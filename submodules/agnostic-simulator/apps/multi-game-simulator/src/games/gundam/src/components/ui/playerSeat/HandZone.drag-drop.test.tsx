// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import type { GameCardData } from "../types.ts";
import { HandZone } from "./HandZone.tsx";
import { GundamDragDropProvider } from "./gundam-drag-drop-context.tsx";

const playableCard: GameCardData = {
  id: "playable-unit",
  name: "Playable Unit",
  cardType: "unit",
  cost: 1,
};

const disabledCard: GameCardData = {
  id: "disabled-unit",
  name: "Disabled Unit",
  cardType: "unit",
  cost: 3,
};

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: () => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

afterEach(cleanup);

describe("HandZone drag affordance", () => {
  it("selects playable cards with Enter and reserves Space for keyboard dragging", async () => {
    const onSelect = vi.fn();
    render(
      <GundamDragDropProvider>
        <HandZone
          hand={[playableCard]}
          isOpponent={false}
          canPlay={() => true}
          onSelect={onSelect}
        />
      </GundamDragDropProvider>,
    );

    const card = screen.getByRole("listitem", { name: "Playable Unit (cost 1)" });
    expect(card.tabIndex).toBe(0);

    fireEvent.focus(card);
    expect(card.style.transform).toContain("translateY(-10px)");

    fireEvent.keyDown(card, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith(0);

    fireEvent.keyDown(card, { key: " ", code: "Space" });
    await waitFor(() => expect(card.getAttribute("aria-pressed")).toBe("true"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("only exposes legal hand cards to the shared pointer drag surface", () => {
    render(
      <GundamDragDropProvider>
        <HandZone
          hand={[playableCard, disabledCard]}
          isOpponent={false}
          canPlay={(card) => card.id === playableCard.id}
        />
      </GundamDragDropProvider>,
    );

    const playable = screen.getByRole("listitem", { name: "Playable Unit (cost 1)" });
    const disabled = screen.getByRole("listitem", { name: "Disabled Unit (cost 3)" });
    expect(playable.getAttribute("draggable")).toBeNull();
    expect(playable.dataset.draggable).toBe("true");
    expect(playable.getAttribute("aria-describedby")).not.toBeNull();
    expect(disabled.getAttribute("draggable")).toBeNull();
    expect(disabled.dataset.draggable).toBe("false");
    expect(disabled.getAttribute("aria-describedby")).toBeNull();
    expect(playable.textContent).toContain("Playable Unit");
  });

  it("keeps Space selection as a fallback when no drag provider is mounted", () => {
    const onSelect = vi.fn();
    render(
      <HandZone
        hand={[playableCard]}
        isOpponent={false}
        canPlay={() => true}
        onSelect={onSelect}
      />,
    );

    fireEvent.keyDown(screen.getByRole("listitem"), { key: " ", code: "Space" });
    expect(onSelect).toHaveBeenCalledWith(0);
  });

  it("renders a localized empty-hand count instead of a missing-message token", () => {
    render(<HandZone hand={[]} handCount={0} isOpponent={false} />);

    expect(screen.getByText("0 cards in hand")).not.toBeNull();
    expect(screen.queryByText("[sim.hand.count]")).toBeNull();
  });

  it("does not show a hidden-card overflow count when all mobile cards are rendered", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    const hand = Array.from({ length: 5 }, (_, index) => ({
      ...playableCard,
      id: `card-${index}`,
      name: `Card ${index}`,
    }));

    render(<HandZone hand={hand} handCount={5} isOpponent={false} />);

    await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(5));
    expect(screen.queryByText("+5")).toBeNull();
  });
});
