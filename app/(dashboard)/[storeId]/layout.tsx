import Navbar from "@/components/Navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  // grab the params in the arguments and set the types
  children: React.ReactNode;
  params: { storeId: string };
}) {
  // grab userID from auth
  const { userId } = auth();

  //   check if they are signed in, if not then redirect them to sign in
  if (!userId) {
    redirect("/sign-in");
  }

  //if signed in check for the store of the matching user using the findFirst method and the where parameter, using matching id given and userId
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  //   if there is no store then redirect
  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
