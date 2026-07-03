import type { ButtonHTMLAttributes, ReactNode } from "react";
import classes from "./Sidebar.module.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function SidebarGroupAction({ className, children, ...rest }: Props) {
  return (
    <button
      type="button"
      data-slot="sidebar-group-action"
      className={`${classes.groupAction} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </button>
  );
}
