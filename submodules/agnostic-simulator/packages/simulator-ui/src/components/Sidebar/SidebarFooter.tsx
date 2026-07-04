import type { HTMLAttributes, ReactNode } from "react";
import classes from "./Sidebar.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function SidebarFooter({ className, children, ...rest }: Props) {
  return (
    <div data-slot="sidebar-footer" className={`${classes.footer} ${className ?? ""}`} {...rest}>
      {children}
    </div>
  );
}
