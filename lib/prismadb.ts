//  import the prisam client to use to interact with the database orm
import { PrismaClient } from "@prisma/client";

// using the declare syntax from typescript the scope becomes global so you can use this variable anywhere and that it has the type of Prismaclient or undefined 
declare global {
  var prisma: PrismaClient | undefined;
}

// this creates the actual instance of the prismaClient class and assings it to the prisma db variable, if the globalThis.prisma is already defined it uses the global one
const prismadb = globalThis.prisma || new PrismaClient();

// this check make sure a new prisma client connection isnt spun up everytime next is refreshed 
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;

export default prismadb;
