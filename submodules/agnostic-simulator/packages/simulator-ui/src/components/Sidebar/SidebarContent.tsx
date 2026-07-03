import type { HTMLAttributes, ReactNode } from "react";
import classes from "./Sidebar.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function SidebarContent({ className, children, ...rest }: Props) {
  return (
    <div data-slot="sidebar-content" className={`${classes.content} ${className ?? ""}`} {...rest}>
      {children}
    </div>
  );
}
