import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { cx } from "../class-names";
import { useActiveLayout, type ActiveLayout } from "../hooks/useActiveLayout";
import { SimulatorSidebarIconButton } from "./SimulatorSidebarIconButton";
import classes from "./SimulatorViewportShell.module.css";

export interface SimulatorViewportShellControls {
  readonly sidebarOpen: boolean;
  readonly openSidebar: () => void;
  readonly closeSidebar: () => void;
  readonly toggleSidebar: () => void;
}

export interface SimulatorViewportShellProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  readonly tabletop: ReactNode;
  readonly sidebar: ReactNode;
  readonly mobilePanel: ReactNode;
  readonly mobileTopRail?: ReactNode | ((controls: SimulatorViewportShellControls) => ReactNode);
  readonly mobileBottomRail?: ReactNode | ((controls: SimulatorViewportShellControls) => ReactNode);
  readonly defaultSidebarOpen?: boolean;
  readonly mobileBreakpoint?: number;
  readonly shortViewportBreakpoint?: number;
  /** Explicitly chooses a layout for deterministic visual fixtures and tests. */
  readonly layoutOverride?: ActiveLayout;
  readonly className?: string;
  readonly tabletopClassName?: string;
  readonly sidebarLabel?: string;
  readonly mobilePanelLabel?: string;
  readonly children?: ReactNode;
}

export interface SimulatorViewportSidebarToolsProviderProps {
  readonly children: ReactNode;
  readonly tools: ReactNode;
}

type ViewportRailPosition = "top" | "bottom";
interface ViewportRailHosts {
  readonly top: HTMLElement | null;
  readonly bottom: HTMLElement | null;
}
const ViewportRailContext = createContext<ViewportRailHosts | null>(null);
const ViewportLayoutContext = createContext<ActiveLayout | null>(null);
const ViewportSidebarToolsContext = createContext<ReactNode>(null);
const DRAWER_FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export interface SimulatorViewportRailPortalProps {
  readonly position: ViewportRailPosition;
  readonly children: ReactNode;
}

/** Reports the layout selected by the nearest shared viewport shell. */
export function useSimulatorViewportLayout(): ActiveLayout {
  return useContext(ViewportLayoutContext) ?? "desktop";
}

/** Supplies route-owned operational tools to the shared desktop sidebar and phone drawer. */
export function SimulatorViewportSidebarToolsProvider({
  children,
  tools,
}: SimulatorViewportSidebarToolsProviderProps) {
  return (
    <ViewportSidebarToolsContext.Provider value={tools}>
      {children}
    </ViewportSidebarToolsContext.Provider>
  );
}

/** Moves game-owned mobile chrome into the nearest viewport shell rail. */
export function SimulatorViewportRailPortal({
  position,
  children,
}: SimulatorViewportRailPortalProps) {
  const hosts = useContext(ViewportRailContext);
  const host = hosts?.[position];
  return host ? createPortal(children, host) : null;
}

/**
 * Shared, fixed-viewport simulator chrome.
 *
 * Games supply their own board and rail content. This component owns the
 * desktop collapsible sidebar, phone drawer, safe areas, and page-scroll
 * containment so all simulators expose the same responsive structure.
 */
export function SimulatorViewportShell({
  tabletop,
  sidebar,
  mobilePanel,
  mobileTopRail,
  mobileBottomRail,
  defaultSidebarOpen = true,
  mobileBreakpoint = 767,
  shortViewportBreakpoint = 520,
  layoutOverride,
  className,
  tabletopClassName,
  sidebarLabel = "Match panel",
  mobilePanelLabel = "Match activity",
  children,
  ...rootProps
}: SimulatorViewportShellProps) {
  const responsiveLayout = useActiveLayout(mobileBreakpoint, {
    shortViewportBreakpoint,
    coarsePointerShortViewport: true,
  });
  const layout = layoutOverride ?? responsiveLayout;
  const sidebarTools = useContext(ViewportSidebarToolsContext);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(defaultSidebarOpen);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [topRailHost, setTopRailHost] = useState<HTMLElement | null>(null);
  const [bottomRailHost, setBottomRailHost] = useState<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const drawerTriggerRef = useRef<HTMLElement | null>(null);
  const wasMobileDrawerOpenRef = useRef(false);
  const captureTopRailHost = useCallback((node: HTMLElement | null) => setTopRailHost(node), []);
  const captureBottomRailHost = useCallback(
    (node: HTMLElement | null) => setBottomRailHost(node),
    [],
  );
  const railHosts = useMemo(
    () => ({ top: topRailHost, bottom: bottomRailHost }),
    [bottomRailHost, topRailHost],
  );
  const sidebarOpen = layout === "desktop" ? desktopSidebarOpen : mobileDrawerOpen;
  const openMobileDrawer = useCallback(() => {
    drawerTriggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setMobileDrawerOpen(true);
  }, []);
  const closeMobileDrawer = useCallback(() => setMobileDrawerOpen(false), []);
  const controls: SimulatorViewportShellControls = {
    sidebarOpen,
    openSidebar: () => (layout === "desktop" ? setDesktopSidebarOpen(true) : openMobileDrawer()),
    closeSidebar: () => (layout === "desktop" ? setDesktopSidebarOpen(false) : closeMobileDrawer()),
    toggleSidebar: () =>
      layout === "desktop"
        ? setDesktopSidebarOpen((open) => !open)
        : mobileDrawerOpen
          ? closeMobileDrawer()
          : openMobileDrawer(),
  };

  useEffect(() => {
    if (!mobileDrawerOpen) {
      if (wasMobileDrawerOpenRef.current) {
        wasMobileDrawerOpenRef.current = false;
        const trigger = drawerTriggerRef.current;
        drawerTriggerRef.current = null;
        trigger?.focus();
      }
      return;
    }

    wasMobileDrawerOpenRef.current = true;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileDrawer();
        return;
      }
      if (event.key !== "Tab") return;

      const drawer = drawerRef.current;
      if (!drawer) return;
      const focusableElements = Array.from(
        drawer.querySelectorAll<HTMLElement>(DRAWER_FOCUSABLE_SELECTOR),
      ).filter(
        (element) =>
          !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true",
      );
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements.at(-1);
      if (!firstFocusable || !lastFocusable) {
        event.preventDefault();
        closeButtonRef.current?.focus();
        return;
      }

      const activeElement = document.activeElement;
      if (event.shiftKey && (activeElement === firstFocusable || !drawer.contains(activeElement))) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (
        !event.shiftKey &&
        (activeElement === lastFocusable || !drawer.contains(activeElement))
      ) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMobileDrawer, mobileDrawerOpen]);

  useEffect(() => {
    if (layout === "desktop") setMobileDrawerOpen(false);
  }, [layout]);

  if (layout === "mobile") {
    return (
      <ViewportLayoutContext.Provider value={layout}>
        <ViewportRailContext.Provider value={railHosts}>
          <main
            {...rootProps}
            className={cx(classes.root, classes.mobile, className)}
            data-active-shell="true"
            data-layout="mobile"
          >
            <header className={classes.mobileTopRail} ref={captureTopRailHost}>
              {mobileTopRail ? renderSlot(mobileTopRail, controls) : null}
            </header>
            <section
              key="tabletop"
              className={cx(classes.tabletop, tabletopClassName)}
              data-simulator-tabletop="true"
            >
              {tabletop}
            </section>
            <footer className={classes.mobileBottomRail} ref={captureBottomRailHost}>
              {mobileBottomRail ? renderSlot(mobileBottomRail, controls) : null}
            </footer>
            {mobileDrawerOpen ? (
              <>
                <button
                  type="button"
                  className={classes.backdrop}
                  aria-label={`Close ${mobilePanelLabel}`}
                  onClick={controls.closeSidebar}
                />
                <aside
                  ref={drawerRef}
                  className={classes.drawer}
                  role="dialog"
                  aria-modal="true"
                  aria-label={mobilePanelLabel}
                >
                  <button
                    ref={closeButtonRef}
                    type="button"
                    className={classes.closeButton}
                    onClick={controls.closeSidebar}
                  >
                    Close
                  </button>
                  <div className={classes.sidebarScroller}>
                    <SidebarWithTools tools={sidebarTools}>{mobilePanel}</SidebarWithTools>
                  </div>
                </aside>
              </>
            ) : null}
            {children ? <div className={classes.overlayLayer}>{children}</div> : null}
          </main>
        </ViewportRailContext.Provider>
      </ViewportLayoutContext.Provider>
    );
  }

  return (
    <ViewportLayoutContext.Provider value={layout}>
      <ViewportRailContext.Provider value={railHosts}>
        <main
          {...rootProps}
          className={cx(
            classes.root,
            classes.desktop,
            desktopSidebarOpen ? classes.desktopExpanded : classes.desktopCollapsed,
            className,
          )}
          data-active-shell="true"
          data-layout="desktop"
          data-sidebar-open={desktopSidebarOpen}
        >
          {desktopSidebarOpen ? (
            <aside className={classes.desktopSidebar} aria-label={sidebarLabel}>
              <SimulatorSidebarIconButton
                className={cx(classes.desktopToggle, classes.desktopCollapse)}
                onClick={controls.closeSidebar}
                aria-label="Collapse sidebar"
                aria-expanded="true"
                title="Collapse sidebar"
              >
                <Chevron direction="left" />
              </SimulatorSidebarIconButton>
              <div className={classes.sidebarScroller}>
                <SidebarWithTools tools={sidebarTools}>{sidebar}</SidebarWithTools>
              </div>
            </aside>
          ) : (
            <SimulatorSidebarIconButton
              className={cx(classes.desktopToggle, classes.desktopReopen)}
              onClick={controls.openSidebar}
              aria-label="Expand sidebar"
              aria-expanded="false"
            >
              <Chevron direction="right" />
            </SimulatorSidebarIconButton>
          )}
          <section
            key="tabletop"
            className={cx(classes.tabletop, tabletopClassName)}
            data-simulator-tabletop="true"
          >
            {tabletop}
          </section>
          {children ? <div className={classes.overlayLayer}>{children}</div> : null}
        </main>
      </ViewportRailContext.Provider>
    </ViewportLayoutContext.Provider>
  );
}

function SidebarWithTools({ children, tools }: { readonly children: ReactNode; tools: ReactNode }) {
  return (
    <div className={classes.sidebarLayout}>
      <div className={classes.sidebarPrimary}>{children}</div>
      {tools ? (
        <div className={classes.sidebarTools} aria-label="Simulator debug tools">
          {tools}
        </div>
      ) : null}
    </div>
  );
}

function renderSlot(
  slot: ReactNode | ((controls: SimulatorViewportShellControls) => ReactNode) | undefined,
  controls: SimulatorViewportShellControls,
) {
  return typeof slot === "function" ? slot(controls) : slot;
}

function Chevron({ direction }: { readonly direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
      <path
        d={direction === "left" ? "m12.5 4-6 6 6 6" : "m7.5 4 6 6-6 6"}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
