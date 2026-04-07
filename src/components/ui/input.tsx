import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[0.65rem] font-bold text-[#476083] uppercase tracking-widest mb-1.5 font-label">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-xl border border-[#c4c6cf] bg-white px-4 py-2 text-sm text-[#191c1d] placeholder:text-[#74777f] transition-all",
              "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus:ring-red-500",
              icon && "pl-10",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-600 font-label">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
