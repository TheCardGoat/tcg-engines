// @vitest-environment jsdom
import { describe, expect, it, afterEach, beforeEach, vi } from "vite-plus/test";
import { render, cleanup, fireEvent } from "@testing-library/react";
import type { ReactNode } from "react";

import { CardFace } from "./CardFace.tsx";
import type { GameCardData } from "../types.ts";
import { TargetingContext, type TargetingContextValue } from "../targeting-context.tsx";

const CANONICAL_WIDTH = 734;
const card: GameCardData = {
  id: "unit_1",
  name: "RX-78-2",
  cardType: "unit",
  ap: 2,
  hp: 3,
};

function Wrap({
  value,
  children,
}: {
  readonly value: TargetingContextValue;
  readonly children: ReactNode;
}) {
  return <TargetingContext.Provider value={value}>{children}</TargetingContext.Provider>;
}

function renderWithTargeting(value: TargetingContextValue, scale = 0.8) {
  const width = Math.round(CANONICAL_WIDTH * scale);
  const height = Math.round((1024 / 734) * width);
  return render(
    <Wrap value={value}>
      <CardFace card={card} width={width} height={height} />
    </Wrap>,
  );
}

describe("CardFace · targeting hover styling", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === "(any-hover: hover)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(cleanup);

  it("applies invalid-target styling on hover when card is not a candidate", () => {
    const { container } = renderWithTargeting({
      active: true,
      candidateIds: new Set(["other_1", "other_2"]),
    });
    const el = container.querySelector<HTMLElement>("[data-card-id='unit_1']")!;
    expect(el.dataset.targetingState).toBeUndefined();
    fireEvent.mouseEnter(el);
    expect(el.dataset.targetingState).toBe("invalid");
    expect(el.style.filter).toContain("saturate");
  });

  it("marks the card as a candidate when id is in the candidate set", () => {
    const { container } = renderWithTargeting({
      active: true,
      candidateIds: new Set(["unit_1"]),
    });
    const el = container.querySelector<HTMLElement>("[data-card-id='unit_1']")!;
    expect(el.dataset.targetingState).toBe("candidate");
    fireEvent.mouseEnter(el);
    // Hovering a candidate must NOT flip it to 'invalid'.
    expect(el.dataset.targetingState).toBe("candidate");
    expect(el.style.filter).toBeFalsy();
    expect(el.style.cursor).toBe("pointer");
    expect(el.style.border).toContain("3px solid");
    expect(el.style.border).toContain("rgb(255, 227, 110)");
    expect(el.style.boxShadow).toContain("255,214,64");
    expect(el.className).toContain("gd-target-candidate");
    expect(el.style.transform).toBe("none");
  });

  it("ignores hover when targeting is inactive", () => {
    const { container } = renderWithTargeting({ active: false, candidateIds: new Set() });
    const el = container.querySelector<HTMLElement>("[data-card-id='unit_1']")!;
    fireEvent.mouseEnter(el);
    expect(el.dataset.targetingState).toBeUndefined();
    expect(el.style.filter).toBeFalsy();
  });
});
