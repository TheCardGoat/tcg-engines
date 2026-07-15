import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { Drawer } from "@mantine/core";
import { SIDEBAR_WIDTH_MOBILE } from "./constants";
import { useSidebar } from "./SidebarContext";
import classes from "./Sidebar.module.css";

export type SidebarSide = "left" | "right";
export type SidebarVariant = "sidebar" | "floating" | "inset";
export type SidebarCollapsible = "offcanvas" | "icon" | "none";

interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  side?: SidebarSide;
  variant?: SidebarVariant;
  collapsible?: SidebarCollapsible;
  children?: ReactNode;
}

export function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...rest
}: SidebarProps) {
  const sidebar = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        data-side={side}
        data-variant={variant}
        className={`${classes.sidebar} ${classes.sidebarStatic} ${className ?? ""}`}
        {...rest}
      >
        {children}
      </div>
    );
  }

  if (sidebar.isMobile) {
    return (
      <Drawer
        opened={sidebar.openMobile}
        onClose={() => sidebar.setOpenMobile(false)}
        position={side}
        size={SIDEBAR_WIDTH_MOBILE}
        withCloseButton={false}
        padding={0}
        classNames={{ content: classes.mobileDrawer, body: classes.mobileBody }}
        aria-label="Sidebar"
      >
        <div data-slot="sidebar" data-mobile="true" className={classes.mobileInner}>
          {children}
        </div>
      </Drawer>
    );
  }

  const collapsibleAttr = sidebar.state === "collapsed" ? collapsible : "";

  return (
    <div
      className={classes.sidebarRoot}
      data-state={sidebar.state}
      data-collapsible={collapsibleAttr}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* Layout spacer that pushes content over by the sidebar's effective width. */}
      <div data-slot="sidebar-gap" className={classes.gap} />
      <div
        data-slot="sidebar-container"
        className={`${classes.container} ${className ?? ""}`}
        style={{ ["--sidebar-side" as string]: side } as CSSProperties}
        {...rest}
      >
        <div data-slot="sidebar-inner" className={classes.inner}>
          {children}
        </div>
      </div>
    </div>
  );
}
