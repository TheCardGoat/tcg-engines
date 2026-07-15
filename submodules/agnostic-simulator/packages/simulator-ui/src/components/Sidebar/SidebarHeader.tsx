import type { HTMLAttributes, ReactNode } from "react";
import classes from "./Sidebar.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function SidebarHeader({ className, children, ...rest }: Props) {
  return (
    <div data-slot="sidebar-header" className={`${classes.header} ${className ?? ""}`} {...rest}>
      {children}
    </div>
  );
}
