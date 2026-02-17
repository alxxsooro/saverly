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
          "w-full rounded-xl border bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-60",
          error
            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
            : "border-neutral-200 hover:border-neutral-300",
          className,
        ].join(" ")}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
