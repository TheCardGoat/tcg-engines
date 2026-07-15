import type { HTMLAttributes, ReactNode } from "react";
import classes from "./Sidebar.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function SidebarGroupLabel({ className, children, ...rest }: Props) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={`${classes.groupLabel} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </div>
  );
}
