import { useLayoutEffect, useState, type CSSProperties, type RefObject } from "react";
import { TABLE_HEIGHT, TABLE_WIDTH } from "./layout";

/** Screen-space instruments share one scale and edge inset, independent of the camera. */
export function useFlatBoardLayout(ref: RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: TABLE_WIDTH, height: TABLE_HEIGHT });
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    // Measure synchronously first: ResizeObserver callbacks are delivered
    // during rendering steps, and an occluded/backing-suspended pane can
    // starve them indefinitely — leaving the board at its unscaled 1600×900
    // default with the hand clipped off-screen and every drag unreachable.
    // Forced layout reads work even while rendering is suspended.
    const measure = () => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (width && height) setSize({ width, height });
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(element);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ref]);
  const scale = Math.min(size.width / TABLE_WIDTH, size.height / TABLE_HEIGHT, 1.25);
  const x = (size.width / scale - TABLE_WIDTH) / 2;
  const y = (size.height / scale - TABLE_HEIGHT) / 2;
  return {
    anchors: { x, top: y, bottom: y, field: 0 },
    scale,
    // Phones render the table under half scale; compact swaps in the denser
    // instrument columns and larger cards instead of shrinking everything.
    compact: scale <= 0.55,
    style: {
      transform: `translate(${x * scale}px, ${y * scale}px) scale(${scale})`,
      "--edge-x": `${x}px`,
      "--edge-top": `${y}px`,
      "--edge-bottom": `${y}px`,
      "--hud-scale": Math.min(1.5, Math.max(1, 0.68 / scale)),
    } as CSSProperties,
  };
}
