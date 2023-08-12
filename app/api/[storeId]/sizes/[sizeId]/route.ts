// auth is used to handle authentication
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
// NextResponse is used to create http responses
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  // use a try catch block to catch errors and make the code block run more smoothly
  try {
    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    // this will return a response of a json object with the store values when this request method is used
    return NextResponse.json(size);
  } catch (error) {
    // catches the error and shows where its coming from and shows the error
    console.log({ SIZEID_GET: error });
    // then returns a response using the NextResponse class with a status 500 and a message Internal error
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.sizeId) {
      return new NextResponse("Sise id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZEID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  // use a try catch block to catch errors and make the code block run more smoothly
  try {
    // grab the userId from the clerk auth
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;

    // Error handling to check if the user in authorized and if the field name which is specifed in the name model in prisma is present if not then return a response error
    if (!userId) {
      return new NextResponse("Unauthenicated", { status: 400 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });
    // after all the data is destructured and the error handling passses create the store by assinging it to a variable and await a prismadb.store.create
    // it takes an object in the create method with parameters like data, data lets you pass in data you will use in the specfic method
    const size = await prismadb.size.updateMany({
      where: { id: params.sizeId },
      data: {
        name,
        value,
      },
    });

    // this will return a response of a json object with the store values when this request method is used
    return NextResponse.json(size);
  } catch (error) {
    // catches the error and shows where its coming from and shows the error
    console.log({ SIZEID_PATCH: error });
    // then returns a response using the NextResponse class with a status 500 and a message Internal error
    return new NextResponse("Internal error", { status: 500 });
  }
}
