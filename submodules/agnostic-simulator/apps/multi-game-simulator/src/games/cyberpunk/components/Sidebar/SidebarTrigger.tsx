import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { IconLayoutSidebar } from "@tabler/icons-react";
import { useSidebar } from "./SidebarContext";
import classes from "./Sidebar.module.css";

interface SidebarTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function SidebarTrigger({ className, onClick, ...rest }: SidebarTriggerProps) {
  const sidebar = useSidebar();
  return (
    <button
      type="button"
      data-slot="sidebar-trigger"
      aria-label="Toggle sidebar"
      className={`${classes.trigger} ${className ?? ""}`}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        sidebar.toggle();
      }}
      {...rest}
    >
      <IconLayoutSidebar size={18} stroke={1.75} aria-hidden="true" />
    </button>
  );
}
