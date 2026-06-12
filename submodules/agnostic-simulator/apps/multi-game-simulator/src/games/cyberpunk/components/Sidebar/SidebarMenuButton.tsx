import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Tooltip, type FloatingPosition } from "@mantine/core";
import { useSidebar } from "./SidebarContext";
import classes from "./Sidebar.module.css";

export type SidebarMenuButtonVariant = "default" | "outline";
export type SidebarMenuButtonSize = "sm" | "default" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  variant?: SidebarMenuButtonVariant;
  size?: SidebarMenuButtonSize;
  tooltip?: ReactNode;
  tooltipPosition?: FloatingPosition;
}

export function SidebarMenuButton({
  className,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  tooltipPosition,
  children,
  ...rest
}: Props) {
  const sidebar = useSidebar();

  const button = (
    <button
      type="button"
      data-slot="sidebar-menu-button"
      data-size={size}
      data-variant={variant}
      data-active={isActive}
      className={`${classes.menuButton} ${classes[`menuButton_${size}`] ?? ""} ${
        classes[`menuButton_${variant}`] ?? ""
      } ${className ?? ""}`}
      {...rest}
    >
      {children}
    </button>
  );

  // Tooltip is only useful when the desktop sidebar is collapsed to icons —
  // the row labels are hidden, so the tooltip carries the affordance.
  const showTooltip = tooltip != null && !sidebar.isMobile && sidebar.state === "collapsed";

  if (!showTooltip) {
    return button;
  }

  // Default to "left" because cyberpunk uses a right-side sidebar; consumers
  // pointing the sidebar elsewhere can override.
  return (
    <Tooltip label={tooltip} position={tooltipPosition ?? "left"} withArrow>
      {button}
    </Tooltip>
  );
}
