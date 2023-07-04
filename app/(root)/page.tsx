import { UserButton } from "@clerk/nextjs";

export default function SetupPage() {
  return (
    <div className="p-4">
      <UserButton afterSignOutUrl="/" />
      This is a protected route!
    </div>
  );
}
