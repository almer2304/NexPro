import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-[0.65rem] font-bold text-[#476083] uppercase tracking-widest mb-1.5 font-label">
            {label}
          </label>
        )}
        <select
          className={cn(
            "flex h-11 w-full rounded-xl border border-[#c4c6cf] bg-white px-4 py-2 text-sm text-[#191c1d] appearance-none cursor-pointer transition-all",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-600 font-label">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
