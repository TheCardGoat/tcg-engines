import type { HTMLAttributes, ReactNode } from "react";
import classes from "./Sidebar.module.css";

interface Props extends HTMLAttributes<HTMLUListElement> {
  children?: ReactNode;
}

export function SidebarMenuSub({ className, children, ...rest }: Props) {
  return (
    <ul data-slot="sidebar-menu-sub" className={`${classes.menuSub} ${className ?? ""}`} {...rest}>
      {children}
    </ul>
  );
}
