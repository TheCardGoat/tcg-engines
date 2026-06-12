import { useCallback, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { useHotkeys, useMediaQuery } from "@mantine/hooks";
import {
  SIDEBAR_KEYBOARD_SHORTCUT,
  SIDEBAR_MOBILE_QUERY,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
} from "./constants";
import { SidebarContext, type SidebarContextValue } from "./SidebarContext";
import classes from "./Sidebar.module.css";

interface SidebarProviderProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  className,
  style,
  children,
}: SidebarProviderProps) {
  const isMobile = useMediaQuery(SIDEBAR_MOBILE_QUERY) ?? false;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [openMobile, setOpenMobile] = useState(false);

  const open = openProp ?? internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const toggle = useCallback(() => {
    if (isMobile) {
      setOpenMobile((v) => !v);
    } else {
      setOpen(!open);
    }
  }, [isMobile, open, setOpen]);

  useHotkeys([[SIDEBAR_KEYBOARD_SHORTCUT, () => toggle()]]);

  const value = useMemo<SidebarContextValue>(
    () => ({
      open,
      openMobile,
      isMobile,
      state: open ? "expanded" : "collapsed",
      setOpen,
      setOpenMobile,
      toggle,
    }),
    [open, openMobile, isMobile, setOpen, toggle],
  );

  const wrapperStyle = {
    ...style,
    ["--sidebar-width" as string]: SIDEBAR_WIDTH,
    ["--sidebar-width-icon" as string]: SIDEBAR_WIDTH_ICON,
  } as CSSProperties;

  return (
    <SidebarContext.Provider value={value}>
      <div
        data-slot="sidebar-wrapper"
        className={`${classes.wrapper} ${className ?? ""}`}
        style={wrapperStyle}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}
