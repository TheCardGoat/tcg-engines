import { useEffect, useState } from "react";

export type ActiveLayout = "desktop" | "mobile";

export interface ActiveLayoutOptions {
  readonly coarsePointerShortViewport?: boolean;
  readonly shortViewportBreakpoint?: number;
}

export function useActiveLayout(breakpoint = 767, options: ActiveLayoutOptions = {}): ActiveLayout {
  const [layout, setLayout] = useState<ActiveLayout>("desktop");

  useEffect(() => {
    const update = () => {
      const shortCoarseViewport =
        options.coarsePointerShortViewport === true &&
        window.innerHeight <= (options.shortViewportBreakpoint ?? 520) &&
        window.matchMedia?.("(pointer: coarse)").matches;
      setLayout(window.innerWidth <= breakpoint || shortCoarseViewport ? "mobile" : "desktop");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoint, options.coarsePointerShortViewport, options.shortViewportBreakpoint]);

  return layout;
}
