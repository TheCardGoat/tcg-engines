import { useEffect, useState } from "react";

export type ActiveLayout = "desktop" | "mobile";

export interface ActiveLayoutOptions {
  readonly coarsePointerShortViewport?: boolean;
  readonly shortViewportBreakpoint?: number;
  /** Compact landscape windows need a drawer even when the pointer is precise. */
  readonly shortViewportWidthBreakpoint?: number;
}

export function useActiveLayout(breakpoint = 767, options: ActiveLayoutOptions = {}): ActiveLayout {
  const [layout, setLayout] = useState<ActiveLayout>("desktop");

  useEffect(() => {
    const update = () => {
      const shortViewport = window.innerHeight <= (options.shortViewportBreakpoint ?? 520);
      const compactShortViewport =
        shortViewport &&
        ((options.shortViewportWidthBreakpoint !== undefined &&
          window.innerWidth <= options.shortViewportWidthBreakpoint) ||
          (options.coarsePointerShortViewport === true &&
            window.matchMedia?.("(pointer: coarse)").matches));
      setLayout(window.innerWidth <= breakpoint || compactShortViewport ? "mobile" : "desktop");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [
    breakpoint,
    options.coarsePointerShortViewport,
    options.shortViewportBreakpoint,
    options.shortViewportWidthBreakpoint,
  ]);

  return layout;
}
