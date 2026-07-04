import type { HTMLAttributes, ReactNode } from "react";
import classes from "./Sidebar.module.css";

interface Props extends HTMLAttributes<HTMLLIElement> {
  children?: ReactNode;
}

export function SidebarMenuItem({ className, children, ...rest }: Props) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={`${classes.menuItem} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </li>
  );
}
