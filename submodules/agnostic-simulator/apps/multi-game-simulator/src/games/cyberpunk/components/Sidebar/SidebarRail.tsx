import type { ButtonHTMLAttributes } from "react";
import { IconLayoutSidebar } from "@tabler/icons-react";
import { useSidebar } from "./SidebarContext";
import classes from "./Sidebar.module.css";

interface SidebarRailProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function SidebarRail({ className, ...rest }: SidebarRailProps) {
  const sidebar = useSidebar();
  return (
    <button
      type="button"
      data-slot="sidebar-rail"
      aria-label={sidebar.state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
      tabIndex={sidebar.state === "collapsed" ? 0 : -1}
      title={sidebar.state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
      onClick={() => sidebar.toggle()}
      className={`${classes.rail} ${className ?? ""}`}
      {...rest}
    >
      <IconLayoutSidebar size={18} stroke={1.75} aria-hidden="true" />
    </button>
  );
}
