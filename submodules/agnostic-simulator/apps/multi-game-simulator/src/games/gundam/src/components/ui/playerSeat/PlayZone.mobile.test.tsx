// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import type { GameCardData } from "../types.ts";
import { PlayZone } from "./PlayZone.tsx";
import {
  dispatchGundamCardDrop,
  encodeGundamBattleAreaTarget,
  type GundamHandCardDragSource,
} from "./gundam-drag-drop-context.tsx";

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
    cleanup();
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

  it("labels turn and priority independently on the mobile field", async () => {
    render(
      <PlayZone
        side="bottom"
        play={[]}
        selectedCardIds={[]}
        highlightCardIds={[]}
        isTurn
        isPriority={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Turn")).not.toBeNull();
    });
    expect(screen.queryByText("Priority")).toBeNull();
    expect(screen.getByText("Your field")).not.toBeNull();
  });
});
