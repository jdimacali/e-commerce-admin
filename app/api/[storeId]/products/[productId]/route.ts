// auth is used to handle authentication
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
// NextResponse is used to create http responses
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  // use a try catch block to catch errors and make the code block run more smoothly
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    // this will return a response of a json object with the store values when this request method is used
    return NextResponse.json(product);
  } catch (error) {
    // catches the error and shows where its coming from and shows the error
    console.log({ PRODUCTID_GET: error });
    // then returns a response using the NextResponse class with a status 500 and a message Internal error
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  // use a try catch block to catch errors and make the code block run more smoothly
  try {
    // grab the userId from the clerk auth
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
      images,
    } = body;

    // Error handling to check if the user in authorized and if the field name which is specifed in the name model in prisma is present if not then return a response error
    if (!userId) {
      return new NextResponse("Unauthenicated", { status: 400 });
    }
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!price) return new NextResponse("price is required", { status: 400 });
    if (!categoryId)
      return new NextResponse("Category id is required", { status: 400 });
    if (!colorId)
      return new NextResponse("Color id is required", { status: 400 });
    if (!sizeId)
      return new NextResponse("Size id is required", { status: 400 });
    if (!images || !images.length)
      return new NextResponse("Images is required", { status: 400 });

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
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
    await prismadb.product.update({
      where: { id: params.productId },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    // this will return a response of a json object with the store values when this request method is used
    return NextResponse.json(product);
  } catch (error) {
    // catches the error and shows where its coming from and shows the error
    console.log({ PRODUCTID_PATCH: error });
    // then returns a response using the NextResponse class with a status 500 and a message Internal error
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId)
      return new NextResponse("product Id is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const product = await prismadb.product.delete({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
