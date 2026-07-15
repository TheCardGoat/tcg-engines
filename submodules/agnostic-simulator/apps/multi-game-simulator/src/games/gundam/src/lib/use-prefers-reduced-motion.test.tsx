// @vitest-environment jsdom
import { describe, expect, it, afterEach, beforeEach } from "vite-plus/test";
import { render, cleanup } from "@testing-library/react";

import { usePrefersReducedMotion } from "./use-prefers-reduced-motion.ts";

function Probe() {
  const prefers = usePrefersReducedMotion();
  return <span data-testid="val">{String(prefers)}</span>;
}

describe("usePrefersReducedMotion", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    cleanup();
    window.matchMedia = originalMatchMedia;
  });

  beforeEach(() => {
    // Reset for each test.
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

  it("returns true when the OS prefers reduced motion", () => {
    setMatches(true);
    const { getByTestId } = render(<Probe />);
    expect(getByTestId("val").textContent).toBe("true");
  });

  it("returns false when the OS does not prefer reduced motion", () => {
    setMatches(false);
    const { getByTestId } = render(<Probe />);
    expect(getByTestId("val").textContent).toBe("false");
  });

  it("returns false when matchMedia is unavailable", () => {
    // @ts-expect-error — intentionally unset for the no-matchMedia branch.
    delete window.matchMedia;
    const { getByTestId } = render(<Probe />);
    expect(getByTestId("val").textContent).toBe("false");
  });
});
