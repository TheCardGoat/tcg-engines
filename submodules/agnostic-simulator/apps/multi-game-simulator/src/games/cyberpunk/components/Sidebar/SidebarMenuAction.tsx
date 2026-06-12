import type { ButtonHTMLAttributes, ReactNode } from "react";
import classes from "./Sidebar.module.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  showOnHover?: boolean;
  children?: ReactNode;
}

export function SidebarMenuAction({ className, showOnHover = false, children, ...rest }: Props) {
  return (
    <button
      type="button"
      data-slot="sidebar-menu-action"
      data-show-on-hover={showOnHover ? "true" : undefined}
      className={`${classes.menuAction} ${showOnHover ? classes.menuActionHover : ""} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </button>
  );
}
