import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm text-[#888880]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-[#f5f0e8] placeholder:text-[#555550] focus:outline-none focus:border-[#C9A84C] transition-colors text-sm resize-none",
            error && "border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
