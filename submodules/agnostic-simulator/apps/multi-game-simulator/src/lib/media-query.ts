import { useEffect, useState } from "react";

function initialMediaQueryValue(query: string, fallback: boolean): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return fallback;
  }

  return window.matchMedia(query).matches;
}

function subscribeMediaQuery(
  mediaQueryList: MediaQueryList,
  onChange: (event: MediaQueryListEvent) => void,
): () => void {
  if (typeof mediaQueryList.addEventListener === "function") {
    mediaQueryList.addEventListener("change", onChange);
    return () => mediaQueryList.removeEventListener("change", onChange);
  }

  mediaQueryList.addListener(onChange);
  return () => mediaQueryList.removeListener(onChange);
}

export function useMediaQuery(query: string, fallback: boolean): boolean {
  const [matches, setMatches] = useState<boolean>(() => initialMediaQueryValue(query, fallback));

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);
    return subscribeMediaQuery(mediaQueryList, (event) => setMatches(event.matches));
  }, [query]);

  return matches;
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}

export function useHasHover(): boolean {
  return useMediaQuery("(any-hover: hover)", true);
}
