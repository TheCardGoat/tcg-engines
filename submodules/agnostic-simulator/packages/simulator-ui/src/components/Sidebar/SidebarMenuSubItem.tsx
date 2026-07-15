import type { HTMLAttributes, ReactNode } from "react";
import classes from "./Sidebar.module.css";

interface Props extends HTMLAttributes<HTMLLIElement> {
  children?: ReactNode;
}

export function SidebarMenuSubItem({ className, children, ...rest }: Props) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      className={`${classes.menuSubItem} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </li>
  );
}
