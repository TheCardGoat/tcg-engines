// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
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

let resizeObserverCallback: ResizeObserverCallback | undefined;
let resizeObserverTarget: Element | undefined;

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      matches: query === "(any-hover: hover)",
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
  globalThis.ResizeObserver = class ResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      resizeObserverCallback = callback;
    }
    observe(target: Element) {
      resizeObserverTarget = target;
    }
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

    const card = screen.getByRole("button", { name: "Playable Unit (cost 1)" });
    expect(card.tabIndex).toBe(0);
    expect(card.style.transform).toBe("");

    fireEvent.focus(card);
    expect(card.style.transform).toBe("translateY(-10px)");

    fireEvent.keyDown(card, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith(0);

    fireEvent.keyDown(card, { key: " ", code: "Space" });
    await waitFor(() => expect(card.getAttribute("aria-pressed")).toBe("true"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("only exposes legal hand cards to the shared pointer drag surface", () => {
    const { container } = render(
      <GundamDragDropProvider>
        <HandZone
          hand={[playableCard, disabledCard]}
          isOpponent={false}
          canPlay={(card) => card.id === playableCard.id}
        />
      </GundamDragDropProvider>,
    );

    const playable = screen.getByRole("button", { name: "Playable Unit (cost 1)" });
    const disabledDragSurface = container.querySelector<HTMLElement>("[data-draggable='false']");
    const disabled = disabledDragSurface?.closest<HTMLElement>("[role='listitem']");
    expect(playable.getAttribute("draggable")).toBeNull();
    expect(playable.dataset.draggable).toBe("true");
    expect(playable.getAttribute("aria-describedby")).not.toBeNull();
    expect(disabledDragSurface?.getAttribute("draggable")).toBeNull();
    expect(disabledDragSurface?.dataset.draggable).toBe("false");
    expect(disabledDragSurface?.getAttribute("aria-describedby")).toBeNull();
    expect(disabled).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Disabled Unit (cost 3)" })).toBeNull();
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

    fireEvent.keyDown(screen.getByRole("button"), { key: " ", code: "Space" });
    expect(onSelect).toHaveBeenCalledWith(0);
  });

  it("lifts a focused card without reflowing the hand", () => {
    const hand = [playableCard, disabledCard, { ...playableCard, id: "third-unit" }];
    const { container } = render(
      <HandZone hand={hand} isOpponent={false} canPlay={() => true} onSelect={() => {}} />,
    );

    const cards = screen.getAllByRole("button");
    const slots = Array.from(container.querySelectorAll<HTMLElement>(".hand-card"));
    const marginsBeforeFocus = slots.map((slot) => slot.style.marginLeft);

    fireEvent.focus(cards[1]!);

    expect(screen.getByTestId("hand-zone-self").className).toContain("z-[30]");
    expect(screen.getByTestId("hand-zone-self").className).toContain("overflow-visible");
    expect(container.querySelector(".hand-container")?.className).toContain("overflow-visible");
    expect(cards[1]!.style.transform).toContain("translateY(-10px)");
    expect(slots.map((slot) => slot.style.marginLeft)).toEqual(marginsBeforeFocus);
  });

  it("clears stale hover state when the hand becomes non-interactive", () => {
    const hand = [playableCard, disabledCard];
    const { rerender } = render(
      <HandZone hand={hand} isOpponent={false} canPlay={() => true} onSelect={() => {}} />,
    );

    const cards = screen.getAllByRole("button");
    fireEvent.mouseEnter(cards[0]!);
    expect(cards[1]!.style.opacity).not.toBe("1");

    rerender(<HandZone hand={hand} isOpponent={false} canPlay={() => true} />);

    expect(cards[1]!.style.opacity).toBe("1");
    expect(cards[1]!.closest<HTMLElement>(".hand-card")?.style.filter).toBe("none");

    rerender(<HandZone hand={hand} isOpponent={false} canPlay={() => true} onSelect={() => {}} />);

    expect(cards[0]!.style.transform).toBe("");
    expect(cards[1]!.style.opacity).toBe("1");
    expect(cards[1]!.closest<HTMLElement>(".hand-card")?.style.filter).toBe("none");
  });

  it("clears stale focus state when the hand becomes non-interactive", () => {
    const hand = [playableCard, disabledCard];
    const { rerender } = render(
      <HandZone hand={hand} isOpponent={false} canPlay={() => true} onSelect={() => {}} />,
    );

    const cards = screen.getAllByRole("button");
    fireEvent.focus(cards[0]!);
    expect(cards[0]!.style.transform).toBe("translateY(-10px)");

    rerender(<HandZone hand={hand} isOpponent={false} canPlay={() => true} />);
    rerender(<HandZone hand={hand} isOpponent={false} canPlay={() => true} onSelect={() => {}} />);

    expect(cards[0]!.style.transform).toBe("");
    expect(cards[1]!.style.opacity).toBe("1");
  });

  it("uses the available desktop width before overlapping cards", () => {
    const hand = Array.from({ length: 6 }, (_, index) => ({
      ...playableCard,
      id: `card-${index}`,
      name: `Card ${index}`,
    }));
    const { container } = render(<HandZone hand={hand} isOpponent={false} canPlay={() => true} />);

    act(() => {
      resizeObserverCallback?.(
        [
          {
            target: resizeObserverTarget!,
            contentRect: { width: 700 },
          } as ResizeObserverEntry,
        ],
        {} as ResizeObserver,
      );
    });

    const margins = Array.from(container.querySelectorAll<HTMLElement>(".hand-card")).map(
      (slot) => slot.style.marginLeft,
    );
    expect(margins).toEqual(["0px", "8px", "8px", "8px", "8px", "8px"]);
  });

  it("renders a localized empty-hand count instead of a missing-message token", () => {
    render(<HandZone hand={[]} handCount={0} isOpponent={false} />);

    expect(screen.getByText("0 cards in hand")).not.toBeNull();
    expect(screen.queryByText("[sim.hand.count]")).toBeNull();
  });

  it("collapses a known opponent hand and names the resulting state", () => {
    const onToggleTucked = vi.fn();
    const { container, rerender } = render(
      <HandZone
        hand={[{ ...playableCard, faceDown: true }]}
        handCount={1}
        isOpponent
        onToggleTucked={onToggleTucked}
      />,
    );

    const hideButton = screen.getByRole("button", { name: "Hide opponent hand" });
    expect(hideButton.getAttribute("aria-expanded")).toBe("true");
    expect(container.querySelectorAll(".hand-card")).toHaveLength(1);
    fireEvent.click(hideButton);
    expect(onToggleTucked).toHaveBeenCalledOnce();

    rerender(
      <HandZone
        hand={[{ ...playableCard, faceDown: true }]}
        handCount={1}
        isOpponent
        isTucked
        onToggleTucked={onToggleTucked}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Show opponent hand" }).getAttribute("aria-expanded"),
    ).toBe("false");
    expect(container.querySelectorAll(".hand-card")).toHaveLength(0);
    expect(screen.getByRole("status").textContent).toBe("Opponent hand hidden · 1 cards in hand");
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
