import {
  type ButtonHTMLAttributes,
  forwardRef,
  cloneElement,
  isValidElement,
  type ReactElement,
} from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  asChild?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-neutral-950 text-white hover:bg-neutral-800 focus-visible:ring-neutral-950",
  secondary:
    "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-400",
  ghost:
    "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-neutral-400",
  outline:
    "border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-50 focus-visible:ring-neutral-400",
};

const sizeStyles = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-11 px-5 text-sm rounded-xl",
  lg: "h-12 px-6 text-base rounded-xl",
};

const baseStyles =
  "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className = "",
      disabled,
      children,
      asChild,
      ...props
    },
    ref
  ) => {
    const combinedClassName = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className,
    ].join(" ");

    if (asChild && isValidElement(children)) {
      const { type: _type, ...restProps } = props;
      return cloneElement(children as ReactElement<{ className?: string }>, {
        className: [combinedClassName, (children as ReactElement<{ className?: string }>).props?.className].filter(Boolean).join(" "),
        ...restProps,
      });
    }

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={combinedClassName}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
