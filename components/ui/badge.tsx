import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "active" | "trial" | "expired" | "suspended" | "default" | "success" | "warning";
  children: React.ReactNode;
  className?: string;
}

const variants = {
  active: "bg-green-500/10 text-green-400 border border-green-500/20",
  trial: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  expired: "bg-[#888880]/10 text-[#888880] border border-[#888880]/20",
  suspended: "bg-red-500/10 text-red-400 border border-red-500/20",
  default: "bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20",
  success: "bg-green-500/10 text-green-400 border border-green-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
