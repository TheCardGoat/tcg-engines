import type { AnchorHTMLAttributes, ReactNode } from "react";
import classes from "./Sidebar.module.css";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: "sm" | "md";
  isActive?: boolean;
  children?: ReactNode;
}

export function SidebarMenuSubButton({
  className,
  size = "md",
  isActive = false,
  children,
  ...rest
}: Props) {
  return (
    <a
      data-slot="sidebar-menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={`${classes.menuSubButton} ${classes[`menuSubButton_${size}`] ?? ""} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </a>
  );
}
