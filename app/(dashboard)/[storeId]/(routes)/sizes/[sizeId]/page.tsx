import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";

const SizePage = async ({
  params,
}: {
  params: { storeId: string; sizeId: string };
}) => {
  // check if there is already exising category to see if you should show the new one or exisiting one to edit
  const size = await prismadb.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};
export default SizePage;
