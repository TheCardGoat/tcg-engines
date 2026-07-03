import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cx } from "../class-names";

export interface TabletopActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "round";
  icon?: ReactNode;
}

export function TabletopActionButton({
  variant = "round",
  icon,
  children,
  className,
  type = "button",
  ...props
}: TabletopActionButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={cx(
        "tabletop-action-button grid place-items-center rounded-full border text-center font-black shadow-lg disabled:cursor-default",
        variant === "primary"
          ? "aspect-square w-[clamp(82px,8vw,112px)] border-white/55 bg-[radial-gradient(circle_at_50%_45%,rgb(255_255_255_/_18%),transparent_38%),radial-gradient(circle,oklch(0.32_0.067_222),oklch(0.18_0.051_223))] px-3 text-[clamp(15px,1.8vw,24px)] leading-[1.05] text-white shadow-slate-950/25"
          : "h-[46px] w-[46px] border-white/40 bg-[oklch(0.21_0.033_224_/_86%)] text-white shadow-slate-950/25",
        className,
      )}
    >
      {icon ?? children}
    </button>
  );
}
