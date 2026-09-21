import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cx } from "../class-names";
import classes from "./SimulatorSidebarIconButton.module.css";

export type SimulatorSidebarIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/** Shared compact control for viewport chrome and participant-row menus. */
export const SimulatorSidebarIconButton = forwardRef<
  HTMLButtonElement,
  SimulatorSidebarIconButtonProps
>(function SimulatorSidebarIconButton({ className, type = "button", ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(classes.control, className)}
      data-simulator-sidebar-control="true"
      {...props}
    />
  );
});
