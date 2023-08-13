import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { ColorColumn } from "./components/columns";
import ColorsClient from "./components/client";

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  const colors = await prismadb.color.findMany({
    where: { storeId: params.storeId },
    // populate the relation of billboard to be true so we can use it in the data
    orderBy: {
      createdAt: "desc",
    },
  });

  // uses the format method from the date-fns package dependcy to converth the createdAt value to a formated column
  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsClient data={formattedColors} />
      </div>
    </div>
  );
};
export default ColorsPage;
