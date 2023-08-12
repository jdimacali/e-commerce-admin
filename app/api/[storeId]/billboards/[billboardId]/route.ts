// auth is used to handle authentication
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
// NextResponse is used to create http responses
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  // use a try catch block to catch errors and make the code block run more smoothly
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    // this will return a response of a json object with the store values when this request method is used
    return NextResponse.json(billboard);
  } catch (error) {
    // catches the error and shows where its coming from and shows the error
    console.log({ BILLBOARD_GET: error });
    // then returns a response using the NextResponse class with a status 500 and a message Internal error
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
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

    const billboard = await prismadb.billboard.delete({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  // use a try catch block to catch errors and make the code block run more smoothly
  try {
    // grab the userId from the clerk auth
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    // Error handling to check if the user in authorized and if the field name which is specifed in the name model in prisma is present if not then return a response error
    if (!userId) {
      return new NextResponse("Unauthenicated", { status: 400 });
    }
    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("ImageUrl is required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
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
    const billboard = await prismadb.billboard.updateMany({
      where: { id: params.billboardId },
      data: {
        label,
        imageUrl,
      },
    });

    // this will return a response of a json object with the store values when this request method is used
    return NextResponse.json(billboard);
  } catch (error) {
    // catches the error and shows where its coming from and shows the error
    console.log({ BILLBOARDS_PATCH: error });
    // then returns a response using the NextResponse class with a status 500 and a message Internal error
    return new NextResponse("Internal error", { status: 500 });
  }
}
