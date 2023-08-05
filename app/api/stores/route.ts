// auth is used to handle authentication
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
// NextResponse is used to create http responses
import { NextResponse } from "next/server";

// api route for stores using the method post, this allows them to create a new store
// it is exported as an async function and takes a req with a type Request
export async function POST(req: Request) {
  // use a try catch block to catch errors and make the code block run more smoothly
  try {
    // grab the userId from the clerk auth
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;

    // Error handling to check if the user in authorized and if the field name which is specifed in the name model in prisma is present if not then return a response error
    if (!userId) return new NextResponse("Unauthorized", { status: 400 });
    if (!name) return new NextResponse("Name is required", { status: 400 });

    // after all the data is destructured and the error handling passses create the store by assinging it to a variable and await a prismadb.store.create
    // it takes an object in the create method with parameters like data, data lets you pass in data you will use in the specfic method
    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });

    // this will return a response of a json object with the store values when this request method is used
    return NextResponse.json(store);
  } catch (error) {
    // catches the error and shows where its coming from and shows the error
    console.log({ STORES_POST: error });
    // then returns a response using the NextResponse class with a status 500 and a message Internal error
    return new NextResponse("Internal error", { status: 500 });
  }
}
