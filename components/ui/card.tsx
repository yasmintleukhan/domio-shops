import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl border border-[#2a2a2a] bg-[#141414] p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#888880]">{label}</span>
        {icon && <span className="text-[#C9A84C]">{icon}</span>}
      </div>
      <span className="text-3xl font-bold text-[#f5f0e8]">{value}</span>
      {sub && <span className="text-xs text-[#888880]">{sub}</span>}
    </Card>
  );
}
