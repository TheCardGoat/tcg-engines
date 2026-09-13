// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { CARD_IMAGE_DIMENSIONS, CARD_SIZE_SCALES } from "../card/card-image-format.ts";
import type { GameCardData } from "../types.ts";
import { PlayZone } from "./PlayZone.tsx";
import {
  createGundamDragAnimationHandoff,
  dispatchGundamCardDrop,
  encodeGundamBattleAreaTarget,
  GundamDragDropProvider,
  type GundamAttackUnitDragSource,
  type GundamHandCardDragSource,
} from "./gundam-drag-drop-context.tsx";

const DESKTOP_FIELD_CARD_SIZE = "small" as const;
const desktopFieldCardWidthPx = Math.round(
  CARD_IMAGE_DIMENSIONS.full.width * CARD_SIZE_SCALES[DESKTOP_FIELD_CARD_SIZE],
);
const desktopFieldCardHeightPx = Math.round(
  CARD_IMAGE_DIMENSIONS.full.height * CARD_SIZE_SCALES[DESKTOP_FIELD_CARD_SIZE],
);

const unit: GameCardData = {
  id: "unit-1",
  name: "Mobile Suit",
  cardType: "unit",
  ap: 2,
  hp: 4,
  baseAp: 2,
  baseHp: 4,
  exerted: true,
};

describe("PlayZone · mobile stats", () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 390,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      writable: true,
      value: originalInnerHeight,
    });
    cleanup();
  });

  it("uses compact top-aligned field cards in a short landscape viewport", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 568,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      writable: true,
      value: 320,
    });

    const { container } = render(
      <PlayZone side="bottom" play={[unit]} selectedCardIds={[]} highlightCardIds={[]} />,
    );

    const compactWidth = Math.round(CARD_IMAGE_DIMENSIONS.full.width * CARD_SIZE_SCALES.micro);
    await waitFor(() => {
      expect(container.querySelector<HTMLElement>('[data-card-id="unit-1"]')?.style.width).toBe(
        `${compactWidth}px`,
      );
    });
    expect(
      container.querySelector<HTMLElement>("[data-fixed-slot-index='0']")?.className,
    ).toContain("w-[68px]");
  });

  it("renders AP/HP badges on mobile play cards when external bands are disabled", async () => {
    render(<PlayZone side="bottom" play={[unit]} selectedCardIds={[]} highlightCardIds={[]} />);

    await waitFor(() => {
      expect(screen.getByTestId("mobile-play-stat-ap").textContent).toContain("2");
      expect(screen.getByTestId("mobile-play-stat-hp").textContent).toContain("4");
    });

    expect(screen.queryByTestId("play-zone-stats-band")).toBeNull();
  });

  it("renders status chips on mobile play cards when the top band is disabled", async () => {
    render(<PlayZone side="bottom" play={[unit]} selectedCardIds={[]} highlightCardIds={[]} />);

    await waitFor(() => {
      expect(screen.getByTestId("mobile-play-status-badges")).not.toBeNull();
      expect(screen.getByLabelText("RESTED")).not.toBeNull();
    });

    expect(screen.queryByTestId("play-zone-status-band")).toBeNull();
  });

  it("registers the shared battle-area drop target and dispatches its card action", () => {
    const onCardDrop = vi.fn();
    render(
      <PlayZone
        side="bottom"
        play={[]}
        selectedCardIds={[]}
        highlightCardIds={[]}
        onCardDrop={onCardDrop}
      />,
    );

    const zone = screen.getByLabelText("Your battle area drop zone");
    const source: GundamHandCardDragSource = {
      type: "hand-card",
      cardId: "unit-from-hand",
      card: { name: "Unit from hand", cardType: "unit" },
    };
    const target = encodeGundamBattleAreaTarget({ type: "battle-area", playerId: "bottom" });

    expect(zone.getAttribute("aria-label")).toBe("Your battle area drop zone");
    expect(dispatchGundamCardDrop(source, target, onCardDrop)).toBe(true);
    expect(onCardDrop).toHaveBeenCalledWith("unit-from-hand");
  });

  it("uses one battlefield control for delegated card actions and keyboard attack dragging", () => {
    const onCardClick = vi.fn();
    const attackSource: GundamAttackUnitDragSource = {
      type: "attack-unit",
      cardId: unit.id!,
      card: { name: unit.name, cardType: unit.cardType },
      legalTargetIds: ["direct"],
      directTargetLabel: "Attack player",
    };
    const { container } = render(
      <GundamDragDropProvider>
        <PlayZone
          side="bottom"
          play={[unit]}
          selectedCardIds={[]}
          highlightCardIds={[unit.id!]}
          onCardClick={onCardClick}
          attackDragSources={new Map([[unit.id!, attackSource]])}
        />
      </GundamDragDropProvider>,
    );

    const control = screen.getByRole("button", {
      name: "Mobile Suit actions; drag to attack",
    });
    expect(control.querySelector("[role='button']")).toBeNull();
    expect(container.querySelectorAll("[data-card-id='unit-1'][tabindex='0']")).toHaveLength(0);

    const entity = container.querySelector<HTMLElement>("[data-card-id='unit-1']")!;
    const onEntityClick = vi.fn();
    entity.addEventListener("click", onEntityClick);

    fireEvent.click(entity);
    expect(onEntityClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(control, { key: "Enter" });
    expect(onEntityClick).toHaveBeenCalledTimes(2);
    expect(onCardClick).not.toHaveBeenCalled();
  });

  it("arms the animation handoff before dispatching an accepted card drop", () => {
    const events: string[] = [];
    const source: GundamHandCardDragSource = {
      type: "hand-card",
      cardId: "unit-from-hand",
      card: { name: "Unit from hand", cardType: "unit" },
    };
    const target = encodeGundamBattleAreaTarget({ type: "battle-area", playerId: "bottom" });

    expect(
      dispatchGundamCardDrop(
        source,
        target,
        () => events.push("dispatch"),
        () => events.push("handoff"),
      ),
    ).toBe(true);
    expect(events).toEqual(["handoff", "dispatch"]);
  });

  it("consumes a drag animation handoff once and expires stale drops", () => {
    let now = 100;
    const handoff = createGundamDragAnimationHandoff(() => now);

    handoff.arm("fresh-card");
    expect(handoff.consume("fresh-card")).toBe(true);
    expect(handoff.consume("fresh-card")).toBe(false);

    handoff.arm("stale-card");
    now = 1_101;
    expect(handoff.consume("stale-card")).toBe(false);
  });

  it("leaves mobile turn and priority status to persistent match chrome", async () => {
    render(
      <PlayZone
        side="bottom"
        play={[]}
        selectedCardIds={[]}
        highlightCardIds={[]}
        isTurn
        isPriority
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText("Turn")).toBeNull();
      expect(screen.queryByText("Priority")).toBeNull();
    });
  });

  it("does not render redundant field copy in an empty desktop battle area", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1440,
    });

    render(
      <PlayZone
        side="bottom"
        play={[]}
        selectedCardIds={[]}
        highlightCardIds={[]}
        onCardDrop={() => {}}
      />,
    );

    expect(screen.queryByText("Your battle area")).toBeNull();
    expect(screen.queryByText("Deploy units here")).toBeNull();
  });

  it("uses the available desktop field height for readable cards", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1440,
    });

    const { container } = render(
      <PlayZone
        side="bottom"
        play={[unit]}
        selectedCardIds={[]}
        highlightCardIds={[]}
        onCardDrop={() => {}}
      />,
    );

    const zone = await waitFor(() => screen.getByLabelText("Your battle area drop zone"));
    const card = container.querySelector<HTMLElement>('[data-card-id="unit-1"]');

    expect(zone.className).toContain("z-[1]");
    expect(card?.style.width).toBe(`${desktopFieldCardWidthPx}px`);
    expect(card?.style.height).toBe(`${desktopFieldCardHeightPx}px`);
    expect(
      container.querySelector<HTMLElement>("[data-fixed-slot-index='0']")?.className,
    ).toContain("w-[176px]");
  });

  it("keeps desktop field cards contained within their own lane", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1440,
    });

    const props = {
      play: [unit],
      selectedCardIds: [],
      highlightCardIds: ["unit-1"],
    } as const;
    const { container } = render(<PlayZone side="bottom" {...props} />);

    await waitFor(() => {
      expect(container.querySelector("[data-play-zone-card-lane]")).not.toBeNull();
    });
    const lane = container.querySelector("[data-play-zone-card-lane]");
    expect(lane?.className).toContain("overflow-y-hidden");
    expect(lane?.className).not.toContain("translate-y");
  });

  it("keeps desktop battle cards in one keyboard-scrollable lane", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1440,
    });

    const { container } = render(
      <PlayZone
        side="bottom"
        play={[unit, { ...unit, id: "unit-2" }]}
        selectedCardIds={[]}
        highlightCardIds={[]}
      />,
    );

    await waitFor(() => {
      expect(container.querySelector("[data-play-zone-card-lane]")).not.toBeNull();
    });

    const lane = container.querySelector<HTMLElement>("[data-play-zone-card-lane]");
    expect(lane?.className).toContain("flex-nowrap");
    expect(lane?.className).toContain("overflow-x-auto");
    expect(lane?.getAttribute("tabindex")).toBe("0");
    expect(lane?.getAttribute("aria-label")).toContain("Scroll horizontally");
  });

  it("shows only the useful edge control when the desktop field overflows", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1440,
    });

    const { container } = render(
      <PlayZone
        side="bottom"
        play={[unit, { ...unit, id: "unit-2" }]}
        selectedCardIds={[]}
        highlightCardIds={[]}
      />,
    );
    const lane = await waitFor(() =>
      container.querySelector<HTMLElement>("[data-play-zone-card-lane]"),
    );
    expect(lane).not.toBeNull();
    Object.defineProperties(lane!, {
      clientWidth: { configurable: true, value: 400 },
      scrollWidth: { configurable: true, value: 1176 },
      scrollLeft: { configurable: true, writable: true, value: 0 },
    });

    fireEvent.scroll(lane!);
    expect(screen.queryByLabelText("Scroll battle area to first slot")).toBeNull();
    expect(screen.getByLabelText("Scroll battle area to last slot")).not.toBeNull();

    lane!.scrollLeft = 776;
    fireEvent.scroll(lane!);
    expect(screen.getByLabelText("Scroll battle area to first slot")).not.toBeNull();
    expect(screen.queryByLabelText("Scroll battle area to last slot")).toBeNull();
  });

  it("shows the pilot's lower strip beneath its unit for either seat", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1440,
    });
    const pairedUnit: GameCardData = {
      ...unit,
      pairedPilot: {
        id: "pilot-1",
        name: "Pilot",
        cardType: "pilot",
      },
    };
    const props = {
      play: [pairedUnit],
      selectedCardIds: [],
      highlightCardIds: [],
    } as const;

    const { container, rerender } = render(<PlayZone side="top" {...props} />);

    await waitFor(() => {
      expect(container.querySelector("[data-paired-pilot-stack]")).not.toBeNull();
    });
    expectPairedPilotBelowUnit(container);

    rerender(<PlayZone side="bottom" {...props} />);
    expectPairedPilotBelowUnit(container);
  });
});

function expectPairedPilotBelowUnit(container: HTMLElement): void {
  const stack = container.querySelector<HTMLElement>("[data-paired-pilot-stack]");
  const pilot = container.querySelector<HTMLElement>("[data-paired-pilot-card]");
  const unitCard = container.querySelector<HTMLElement>("[data-paired-unit-card]");
  const pilotTop = Number.parseFloat(pilot?.style.top ?? "0");
  const unitOffset = Number.parseFloat(
    unitCard?.style.transform.match(/translateY\((\d+(?:\.\d+)?)px\)/)?.[1] ?? "0",
  );

  expect(stack?.style.marginTop).toBe("");
  expect(Number.parseFloat(stack?.style.marginBottom ?? "0")).toBe(pilotTop);
  expect(pilotTop - unitOffset).toBeGreaterThanOrEqual(44);
}
