import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { CategoryColumn } from "./components/columns";
import CategoryClient from "./components/client";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categories = await prismadb.category.findMany({
    where: { storeId: params.storeId },
    // populate the relation of billboard to be true so we can use it in the data
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // uses the format method from the date-fns package dependcy to converth the createdAt value to a formated column
  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};
export default CategoriesPage;
