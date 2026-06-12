import type { HTMLAttributes, ReactNode } from "react";
import classes from "./Sidebar.module.css";

interface Props extends HTMLAttributes<HTMLUListElement> {
  children?: ReactNode;
}

export function SidebarMenu({ className, children, ...rest }: Props) {
  return (
    <ul data-slot="sidebar-menu" className={`${classes.menu} ${className ?? ""}`} {...rest}>
      {children}
    </ul>
  );
}
