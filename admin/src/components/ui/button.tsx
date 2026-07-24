import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coderic-500/50 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-coderic-600 text-white shadow-md hover:bg-coderic-500",
        outline: "border border-[var(--border-surface)] hover:border-coderic-600/30 hover:bg-coderic-600/5",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        ghost: "text-muted hover:bg-[var(--bg-panel)]",
      },
      size: { default: "h-10 px-5", sm: "h-9 px-4 text-xs" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({ className, variant, size, asChild = false, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
