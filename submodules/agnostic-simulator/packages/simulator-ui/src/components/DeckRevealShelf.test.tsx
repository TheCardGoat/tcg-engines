// @vitest-environment jsdom
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import type { SimulatorDeckReveal } from "@tcg/simulator-contract";

import { DeckRevealShelf } from "./DeckRevealShelf";

const reveal: SimulatorDeckReveal = {
  id: "test-reveal",
  zoneId: "p-deck",
  ownerId: "p1",
  position: "top",
  visibility: "public",
  count: 1,
  turnNumber: 1,
  cards: [
    {
      entityId: "signal-runner",
      title: "Signal Runner",
      subtitle: "Program",
      frameColor: "oklch(0.78 0.17 188)",
    },
  ],
};

let activeRoot: Root | null = null;
let activeContainer: HTMLDivElement | null = null;

afterEach(() => {
  vi.useRealTimers();
  if (activeRoot) {
    act(() => activeRoot?.unmount());
  }
  activeContainer?.remove();
  document.body.querySelectorAll('[data-testid="card-inspector-popover"]').forEach((node) => {
    node.remove();
  });
  activeRoot = null;
  activeContainer = null;
});

function renderShelf(element: ReactNode): HTMLDivElement {
  activeContainer = document.createElement("div");
  document.body.append(activeContainer);
  activeRoot = createRoot(activeContainer);
  act(() => activeRoot?.render(element));
  return activeContainer;
}

function revealedCard(container: HTMLElement): HTMLElement {
  const card = container.querySelector<HTMLElement>('[data-testid="deck-reveal-card"]');
  if (!card) {
    throw new Error("Expected deck reveal card to render.");
  }
  return card;
}

describe("DeckRevealShelf card preview", () => {
  test("shows revealed cards immediately when embedded in a decision surface", () => {
    const container = renderShelf(<DeckRevealShelf reveal={reveal} presentation="inline" />);

    expect(container.querySelector('[data-testid="deck-reveal-inline"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="deck-reveal-shelf"]')).toBeNull();
    expect(revealedCard(container).getAttribute("title")).toBe("Signal Runner");
    expect(container.textContent).toContain("Top revealed");
  });

  test("opens a revealed-card surface from the deck trigger", () => {
    vi.useFakeTimers();
    const container = renderShelf(<DeckRevealShelf reveal={reveal} />);

    act(() => {
      container
        .querySelector<HTMLElement>('[data-testid="deck-reveal-shelf"]')
        ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const revealPopover = document.body.querySelector('[data-testid="deck-reveal-popover"]');
    expect(revealPopover).toBeTruthy();
    expect(revealPopover?.textContent).toContain("Top revealed");

    act(() => {
      revealedCard(document.body).dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      vi.advanceTimersByTime(350);
    });

    const popover = document.body.querySelector('[data-testid="card-inspector-popover"]');
    expect(popover).toBeTruthy();
    expect(popover?.className).toContain("z-[1100]");
    expect(document.body.textContent).toContain("Signal Runner");
  });

  test("opens the revealed-card surface from a touch tap", () => {
    const container = renderShelf(<DeckRevealShelf reveal={reveal} />);
    const tap = new Event("pointerdown", { bubbles: true });
    Object.defineProperty(tap, "pointerType", { value: "touch" });

    act(() => {
      const trigger = container.querySelector<HTMLElement>('[data-testid="deck-reveal-shelf"]');
      trigger?.dispatchEvent(tap);
      trigger?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(document.body.querySelector('[data-testid="deck-reveal-popover"]')).toBeTruthy();
    expect(document.body.textContent).toContain("Signal Runner");
  });
});
