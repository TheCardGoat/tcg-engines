// @vitest-environment jsdom
import { describe, expect, it, afterEach } from "vite-plus/test";
import { render, cleanup } from "@testing-library/react";

import { useHasHover } from "./use-has-hover.ts";

function Probe() {
  const hasHover = useHasHover();
  return <span data-testid="val">{String(hasHover)}</span>;
}

describe("useHasHover", () => {
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

  it("returns true when the device reports hover capability", () => {
    setMatches(true);
    const { getByTestId } = render(<Probe />);
    expect(getByTestId("val").textContent).toBe("true");
  });

  it("returns false on touch-only devices", () => {
    setMatches(false);
    const { getByTestId } = render(<Probe />);
    expect(getByTestId("val").textContent).toBe("false");
  });

  it("defaults to true when matchMedia is unavailable", () => {
    // @ts-expect-error — intentionally unset for the no-matchMedia branch.
    delete window.matchMedia;
    const { getByTestId } = render(<Probe />);
    expect(getByTestId("val").textContent).toBe("true");
  });

  it("queries the `any-hover` capability so hybrid devices keep hover UI", () => {
    const queries: string[] = [];
    window.matchMedia = ((query: string) => {
      queries.push(query);
      return {
        matches: true,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      };
    }) as unknown as typeof window.matchMedia;
    render(<Probe />);
    expect(queries).toContain("(any-hover: hover)");
  });
});
