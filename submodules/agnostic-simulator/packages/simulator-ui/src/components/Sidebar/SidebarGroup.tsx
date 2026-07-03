import type { HTMLAttributes, ReactNode } from "react";
import classes from "./Sidebar.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function SidebarGroup({ className, children, ...rest }: Props) {
  return (
    <div data-slot="sidebar-group" className={`${classes.group} ${className ?? ""}`} {...rest}>
      {children}
    </div>
  );
}
