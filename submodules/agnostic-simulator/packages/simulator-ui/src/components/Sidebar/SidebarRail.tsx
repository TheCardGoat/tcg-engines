import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { IconLayoutSidebar } from "@tabler/icons-react";
import { useSidebar } from "./SidebarContext";
import classes from "./Sidebar.module.css";

interface SidebarRailProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function SidebarRail({ className, onClick, ...rest }: SidebarRailProps) {
  const sidebar = useSidebar();
  return (
    <button
      type="button"
      data-slot="sidebar-rail"
      aria-label={sidebar.state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
      title={sidebar.state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        sidebar.toggle();
      }}
      className={`${classes.rail} ${className ?? ""}`}
      {...rest}
    >
      <IconLayoutSidebar size={18} stroke={1.75} aria-hidden="true" />
    </button>
  );
}
