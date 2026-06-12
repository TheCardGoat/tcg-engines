import { createContext, useContext } from "react";

export type SidebarState = "expanded" | "collapsed";

export interface SidebarContextValue {
  open: boolean;
  openMobile: boolean;
  isMobile: boolean;
  state: SidebarState;
  setOpen: (open: boolean) => void;
  setOpenMobile: (open: boolean) => void;
  toggle: () => void;
}

export const SidebarContext = createContext<SidebarContextValue | null>(null);

const NOOP_VALUE: SidebarContextValue = {
  open: true,
  openMobile: false,
  isMobile: false,
  state: "expanded",
  setOpen: () => {},
  setOpenMobile: () => {},
  toggle: () => {},
};

// Outside a provider the hook returns a no-op default so individual sidebar
// pieces can render in stories or isolated tests without a wrapper.
export function useSidebar(): SidebarContextValue {
  return useContext(SidebarContext) ?? NOOP_VALUE;
}
