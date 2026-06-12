import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils.ts";

/**
 * Cockpit button primitive.
 *
 * Variants follow the Gundam HUD design system: `primary` is the affirmative
 * gold-gradient action (Confirm / Accept), `danger` is the destructive red
 * (Concede / Reject), `cockpit` is the heavyweight pulsing "engage" state
 * (Pass Turn), `default` is the neutral surface panel, `outline` is a
 * transparent stroked alternative, `ghost` is chrome-less (icon-adjacent).
 *
 * All variants set a beveled `clip-hud-4` corner by default — override with
 * `className="clip-hud-6"` / `clip-hud-8` / etc. for a different HUD shape.
 *
 * Shadcn-style API: supports `asChild` via Radix `<Slot>` so consumers can
 * render the button as a link or other element while keeping the styles.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display uppercase tracking-hud-display font-extrabold transition-[box-shadow,filter,background,border-color,color] duration-150 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hud-info focus-visible:ring-offset-1 focus-visible:ring-offset-hud-bg clip-hud-4",
  {
    variants: {
      variant: {
        default:
          "surface-panel text-hud-text border-hud-border hover:border-hud-border-hot hover:text-hud-accent-hot cursor-pointer",
        primary:
          "bg-[linear-gradient(180deg,#2d6bff,#1c4cd1)] text-white border border-hud-accent-hot hover:glow-accent cursor-pointer",
        danger:
          "bg-[linear-gradient(180deg,#ff2d7a,#c8155a)] text-white border border-hud-danger hover:glow-danger cursor-pointer",
        outline:
          "bg-transparent text-hud-text border border-hud-border hover:border-hud-border-hot hover:bg-hud-surface/50 cursor-pointer",
        ghost:
          "bg-transparent text-hud-text-muted border border-transparent hover:bg-hud-surface-raised/40 hover:text-hud-text cursor-pointer",
        cockpit:
          "pass-btn-active bg-[linear-gradient(180deg,#ff2d7a_0%,#e0186a_60%,#c8155a_100%)] text-white border border-hud-danger/80 cursor-pointer",
      },
      size: {
        sm: "h-6 px-2 text-hud-xs",
        md: "h-8 px-3 text-hud-md",
        lg: "h-11 px-4 text-hud-lg",
        xl: "h-[68px] px-[18px] text-hud-lg flex-col gap-0.5",
        icon: "h-8 w-8 p-0 text-hud-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  readonly asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  },
);

Button.displayName = "Button";
