// auth is used to handle authentication
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
// NextResponse is used to create http responses
import { NextResponse } from "next/server";

// api route for stores using the method post, this allows them to create a new store
// it is exported as an async function and takes a req with a type Request
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  // use a try catch block to catch errors and make the code block run more smoothly
  try {
    // grab the userId from the clerk auth
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    // Error handling to check if the user in authorized and if the field name which is specifed in the name model in prisma is present if not then return a response error
    if (!userId) return new NextResponse("Unauthenicated", { status: 400 });
    if (!label) return new NextResponse("Label is required", { status: 400 });
    if (!imageUrl)
      return new NextResponse("ImageUrl is required", { status: 400 });

    if (!params.storeId)
      return new NextResponse("tore Id is required", { status: 400 });

    const storeByUserId = prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });
    // after all the data is destructured and the error handling passses create the store by assinging it to a variable and await a prismadb.store.create
    // it takes an object in the create method with parameters like data, data lets you pass in data you will use in the specfic method
    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    // this will return a response of a json object with the store values when this request method is used
    return NextResponse.json(billboard);
  } catch (error) {
    // catches the error and shows where its coming from and shows the error
    console.log({ BILLBOARDS_POST: error });
    // then returns a response using the NextResponse class with a status 500 and a message Internal error
    return new NextResponse("Internal error", { status: 500 });
  }
}

// api route for stores using the method GET, this allows them to create a new store
// it is exported as an async function and takes a req with a type Request
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  // use a try catch block to catch errors and make the code block run more smoothly
  try {
    if (!params.storeId)
      return new NextResponse("tore Id is required", { status: 400 });

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    // this will return a response of a json object with the store values when this request method is used
    return NextResponse.json(billboards);
  } catch (error) {
    // catches the error and shows where its coming from and shows the error
    console.log({ BILLBOARDS_GET: error });
    // then returns a response using the NextResponse class with a status 500 and a message Internal error
    return new NextResponse("Internal error", { status: 500 });
  }
}
