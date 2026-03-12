import { type InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={[
          "w-full rounded-xl border bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-500 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-neutral-900",
          "disabled:cursor-not-allowed disabled:opacity-60",
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-neutral-700 hover:border-neutral-600",
          className,
        ].join(" ")}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
