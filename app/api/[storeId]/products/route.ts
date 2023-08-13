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
    if (!userId) return new NextResponse("Unauthenicated", { status: 400 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!price) return new NextResponse("price is required", { status: 400 });
    if (!categoryId)
      return new NextResponse("categoryId is required", { status: 400 });
    if (!colorId)
      return new NextResponse("colorId is required", { status: 400 });
    if (!sizeId) return new NextResponse("sizeId is required", { status: 400 });
    if (!images || !images.length)
      return new NextResponse("images is required", { status: 400 });

    if (!params.storeId)
      return new NextResponse("store Id is required", { status: 400 });

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
    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        storeId: params.storeId,
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
    console.log({ PRODUCT_POST: error });
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
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId)
      return new NextResponse("tore Id is required", { status: 400 });

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // this will return a response of a json object with the store values when this request method is used
    return NextResponse.json(products);
  } catch (error) {
    // catches the error and shows where its coming from and shows the error
    console.log({ PRODUCTS_GET: error });
    // then returns a response using the NextResponse class with a status 500 and a message Internal error
    return new NextResponse("Internal error", { status: 500 });
  }
}
