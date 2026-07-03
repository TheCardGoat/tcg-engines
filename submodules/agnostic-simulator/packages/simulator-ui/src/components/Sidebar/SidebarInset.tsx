import type { HTMLAttributes, ReactNode } from "react";
import classes from "./Sidebar.module.css";

interface SidebarInsetProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export function SidebarInset({ className, children, ...rest }: SidebarInsetProps) {
  return (
    <main data-slot="sidebar-inset" className={`${classes.inset} ${className ?? ""}`} {...rest}>
      {children}
    </main>
  );
}
