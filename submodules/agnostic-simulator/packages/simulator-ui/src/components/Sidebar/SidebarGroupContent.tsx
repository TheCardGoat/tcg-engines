import type { HTMLAttributes, ReactNode } from "react";
import classes from "./Sidebar.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function SidebarGroupContent({ className, children, ...rest }: Props) {
  return (
    <div
      data-slot="sidebar-group-content"
      className={`${classes.groupContent} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </div>
  );
}
