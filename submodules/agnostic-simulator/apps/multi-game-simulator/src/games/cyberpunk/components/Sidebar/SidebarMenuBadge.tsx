import type { HTMLAttributes, ReactNode } from "react";
import classes from "./Sidebar.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function SidebarMenuBadge({ className, children, ...rest }: Props) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      className={`${classes.menuBadge} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </div>
  );
}
