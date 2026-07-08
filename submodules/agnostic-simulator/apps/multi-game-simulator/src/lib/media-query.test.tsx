// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";

import { useHasHover, usePrefersReducedMotion } from "./media-query.ts";

function ReducedMotionProbe() {
  const prefersReducedMotion = usePrefersReducedMotion();
  return <span data-testid="value">{String(prefersReducedMotion)}</span>;
}

function HoverProbe() {
  const hasHover = useHasHover();
  return <span data-testid="value">{String(hasHover)}</span>;
}

describe("shared media query hooks", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    cleanup();
    window.matchMedia = originalMatchMedia;
  });

  function setMatches(matches: boolean) {
    window.matchMedia = ((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  }

  it("uses false as the reduced-motion fallback", () => {
    // @ts-expect-error Intentionally unset for the no-matchMedia branch.
    delete window.matchMedia;
    const { getByTestId } = render(<ReducedMotionProbe />);
    expect(getByTestId("value").textContent).toBe("false");
  });

  it("uses true as the hover-capability fallback", () => {
    // @ts-expect-error Intentionally unset for the no-matchMedia branch.
    delete window.matchMedia;
    const { getByTestId } = render(<HoverProbe />);
    expect(getByTestId("value").textContent).toBe("true");
  });

  it("reads the active media query result", () => {
    setMatches(true);
    const { getByTestId } = render(<ReducedMotionProbe />);
    expect(getByTestId("value").textContent).toBe("true");
  });

  it("reads touch-only hover capability before the first effect runs", () => {
    setMatches(false);
    const { getByTestId } = render(<HoverProbe />);
    expect(getByTestId("value").textContent).toBe("false");
  });
});
