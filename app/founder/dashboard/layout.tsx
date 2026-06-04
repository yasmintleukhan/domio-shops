import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar, founderNavItems } from "@/components/dashboard/sidebar";

export default async function FounderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/founder/login");

  const user = session.user as any;
  if (user.role !== "founder") redirect("/founder/login");

  return (
    <div className="flex h-screen bg-[#0d0d0d] overflow-hidden">
      <Sidebar items={founderNavItems} logoHref="/founder/dashboard" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#141414] border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h1 className="text-[#f5f0e8] font-semibold">Founder Panel</h1>
          <span className="text-xs text-[#888880]">founder@domio.top</span>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
