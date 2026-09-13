// @vitest-environment jsdom
import { describe, expect, it, afterEach, beforeEach, vi } from "vite-plus/test";
import { render, cleanup, fireEvent } from "@testing-library/react";
import type { ReactNode } from "react";
import { TargetingContext, type TargetingContextValue } from "@tcg/simulator-ui";

import { CardFace } from "./CardFace.tsx";
import type { GameCardData } from "../types.ts";
import {
  LinkTargetPreviewContext,
  type LinkTargetPreviewValue,
} from "../link-target-preview-context.tsx";

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
  linkValue = { active: false, linkCandidateIds: new Set() },
  children,
}: {
  readonly value: TargetingContextValue;
  readonly linkValue?: LinkTargetPreviewValue;
  readonly children: ReactNode;
}) {
  return (
    <LinkTargetPreviewContext.Provider value={linkValue}>
      <TargetingContext.Provider value={value}>{children}</TargetingContext.Provider>
    </LinkTargetPreviewContext.Provider>
  );
}

function renderWithTargeting(
  value: TargetingContextValue,
  scale = 0.8,
  linkValue?: LinkTargetPreviewValue,
) {
  const width = Math.round(CANONICAL_WIDTH * scale);
  const height = Math.round((1024 / 734) * width);
  return render(
    <Wrap value={value} linkValue={linkValue}>
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
    const aura = container.querySelector<HTMLElement>("[data-card-aura]")!;
    expect(aura.style.boxShadow).toContain("255,214,64");
    expect(el.className).toContain("gd-target-candidate");
    expect(container.querySelector<HTMLElement>(".gd-card-shell")!.style.transform).toBe("none");
  });

  it("distinguishes a candidate that meets the selected Pilot's Link Condition", () => {
    const { container } = renderWithTargeting(
      {
        active: true,
        candidateIds: new Set(["unit_1"]),
        role: "unit",
      },
      0.8,
      {
        active: true,
        linkCandidateIds: new Set(["unit_1"]),
      },
    );
    const el = container.querySelector<HTMLElement>("[data-card-id='unit_1']")!;
    const aura = container.querySelector<HTMLElement>("[data-card-aura]")!;

    expect(el.dataset.targetingState).toBe("link-candidate");
    expect(el.style.border).toContain("rgb(134, 255, 209)");
    expect(el.className).toContain("gd-target-link");
    expect(aura.className).toContain("gd-target-link");
    expect(aura.style.boxShadow).toContain("52,235,166");
    expect(container.querySelector("[data-testid='link-target-marker']")).not.toBeNull();
    expect(el.getAttribute("aria-label")).toContain("Link Condition met");
  });

  it("ignores hover when targeting is inactive", () => {
    const { container } = renderWithTargeting({ active: false, candidateIds: new Set() });
    const el = container.querySelector<HTMLElement>("[data-card-id='unit_1']")!;
    fireEvent.mouseEnter(el);
    expect(el.dataset.targetingState).toBeUndefined();
    expect(el.style.filter).toBeFalsy();
  });
});
