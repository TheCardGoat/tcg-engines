import { useEffect, useState } from "react";

export type ActiveLayout = "desktop" | "mobile";

function getInitialLayout(breakpoint: number): ActiveLayout {
  if (typeof window === "undefined") {
    return "desktop";
  }
  return window.innerWidth > breakpoint ? "desktop" : "mobile";
}

export function useActiveLayout(breakpoint = 1280): ActiveLayout {
  const [layout, setLayout] = useState<ActiveLayout>(() => getInitialLayout(breakpoint));

  useEffect(() => {
    const update = () => {
      setLayout(window.innerWidth > breakpoint ? "desktop" : "mobile");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoint]);

  return layout;
}
