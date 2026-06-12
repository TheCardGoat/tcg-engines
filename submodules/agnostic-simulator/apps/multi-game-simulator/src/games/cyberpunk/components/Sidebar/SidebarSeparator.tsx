import type { HTMLAttributes } from "react";
import classes from "./Sidebar.module.css";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export function SidebarSeparator({ className, ...rest }: Props) {
  return (
    <div
      data-slot="sidebar-separator"
      role="separator"
      className={`${classes.separator} ${className ?? ""}`}
      {...rest}
    />
  );
}
