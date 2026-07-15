// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vite-plus/test";

import type { GameCardData } from "../types.ts";
import { PlayZone } from "./PlayZone.tsx";

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
});
