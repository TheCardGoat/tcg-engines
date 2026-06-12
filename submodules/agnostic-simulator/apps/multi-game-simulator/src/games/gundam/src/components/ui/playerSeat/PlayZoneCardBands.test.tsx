// @vitest-environment jsdom
import { describe, expect, it, afterEach } from "vite-plus/test";
import { render, cleanup } from "@testing-library/react";

import { PlayZoneCardBands } from "./PlayZoneCardBands.tsx";
import type { GameCardData } from "../types.ts";

describe("PlayZoneCardBands", () => {
  afterEach(cleanup);

  const unit: GameCardData = {
    id: "unit_1",
    name: "RX-78-2",
    cardType: "unit",
    ap: 3,
    hp: 4,
    baseAp: 2,
    baseHp: 4,
    keywords: [{ keyword: "Blocker" }, { keyword: "Repair", value: 1 }],
  };

  it("top band renders status chips (no damage chip — handled by center overlay)", () => {
    const { getByTestId, getByLabelText } = render(
      <PlayZoneCardBands card={{ ...unit, damage: 2 }} section="top" />,
    );
    const band = getByTestId("play-zone-status-band");
    expect(band.getAttribute("aria-hidden")).toBe("false");
    // Blocker + Repair collapsed into the Lorcana-style hover stack;
    // damage is omitted, so the stack count remains 2 instead of 3.
    expect(getByLabelText("2 tags")).toBeTruthy();
  });

  it("top band is aria-hidden when there are no tags", () => {
    const bare: GameCardData = { id: "x", name: "Bare", cardType: "unit" };
    const { getByTestId } = render(<PlayZoneCardBands card={bare} section="top" />);
    expect(getByTestId("play-zone-status-band").getAttribute("aria-hidden")).toBe("true");
  });

  it("bottom band renders AP + HP circles with tone-by-delta", () => {
    const { getByTestId } = render(<PlayZoneCardBands card={unit} section="bottom" />);
    const ap = getByTestId("play-zone-stat-ap");
    const hp = getByTestId("play-zone-stat-hp");
    expect(ap.textContent).toContain("3");
    expect(ap.className).toContain("play-pill--buffed");
    expect(hp.textContent).toContain("4");
    // Neutral HP → base color class, not buffed/debuffed.
    expect(hp.className).toContain("play-pill--hp");
    expect(hp.className).not.toContain("play-pill--buffed");
  });

  it("bottom band is aria-hidden for non-unit cards", () => {
    const cmd: GameCardData = { id: "c_1", name: "Cmd", cardType: "command" };
    const { getByTestId } = render(<PlayZoneCardBands card={cmd} section="bottom" />);
    expect(getByTestId("play-zone-stats-band").getAttribute("aria-hidden")).toBe("true");
  });

  it("bottom band renders base armor as an HP circle", () => {
    const base: GameCardData = { id: "b_1", name: "Base", cardType: "base", hp: 3, baseHp: 3 };
    const { getByTestId, queryByTestId } = render(
      <PlayZoneCardBands card={base} section="bottom" />,
    );
    expect(getByTestId("play-zone-stats-band").getAttribute("aria-hidden")).toBe("false");
    expect(getByTestId("play-zone-stat-hp").textContent).toContain("3");
    expect(queryByTestId("play-zone-stat-ap")).toBeNull();
  });

  it("bottom band applies debuffed tone when HP is below base", () => {
    const wounded: GameCardData = {
      id: "u",
      name: "Wounded",
      cardType: "unit",
      hp: 1,
      baseHp: 4,
      ap: 2,
      baseAp: 2,
    };
    const { getByTestId } = render(<PlayZoneCardBands card={wounded} section="bottom" />);
    expect(getByTestId("play-zone-stat-hp").className).toContain("play-pill--debuffed");
    expect(getByTestId("play-zone-stat-ap").className).toContain("play-pill--ap");
  });
});
