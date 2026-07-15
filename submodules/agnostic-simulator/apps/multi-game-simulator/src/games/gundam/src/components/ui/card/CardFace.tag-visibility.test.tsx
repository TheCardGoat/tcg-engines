// @vitest-environment jsdom
import { describe, expect, it, afterEach } from "vite-plus/test";
import { render, cleanup } from "@testing-library/react";

import { CardFace } from "./CardFace.tsx";
import type { GameCardData } from "../types.ts";

/**
 * The tag strip used to be gated at `scale >= 0.75`, which hid every
 * keyword/status chip on the play-area (where cards render below that
 * scale). Regression coverage pins visibility across the scale buckets
 * defined in `CardFace.tsx`.
 */
describe("CardFace · tag strip visibility across scales", () => {
  afterEach(cleanup);

  const CANONICAL_WIDTH = 734;
  const card: GameCardData = {
    id: "unit_1",
    name: "RX-78-2",
    cardType: "unit",
    ap: 2,
    hp: 3,
    baseAp: 2,
    baseHp: 3,
    color: "blue",
    keywords: [{ keyword: "Blocker" }, { keyword: "Repair", value: 1 }],
    exerted: true,
  };

  function renderAtScale(scale: number) {
    const width = Math.round(CANONICAL_WIDTH * scale);
    const height = Math.round((1024 / 734) * width);
    return render(<CardFace card={card} width={width} height={height} />);
  }

  it("shows the tag strip at small play-area scale (0.55)", () => {
    const { getByLabelText } = renderAtScale(0.55);
    expect(getByLabelText("BLOCK")).toBeTruthy();
  });

  it("shows the tag strip at medium scale (0.8)", () => {
    const { getByLabelText } = renderAtScale(0.8);
    expect(getByLabelText("BLOCK")).toBeTruthy();
  });

  it("renders icon-only chips at tiny scale (<0.55)", () => {
    const { getByLabelText } = renderAtScale(0.5);
    const chip = getByLabelText("BLOCK");
    expect(chip).not.toBeNull();
    expect(chip.textContent).toBe("");
  });

  it("hides the tag strip below the absolute floor", () => {
    const { container } = renderAtScale(0.4);
    expect(container.querySelector("[aria-label='BLOCK']")).toBeNull();
  });

  it("suppresses the tag strip when hideSupplementalBadges is set", () => {
    const width = Math.round(CANONICAL_WIDTH * 0.8);
    const height = Math.round((1024 / 734) * width);
    const { container } = render(
      <CardFace card={card} width={width} height={height} hideSupplementalBadges />,
    );
    expect(container.querySelector("[aria-label='BLOCK']")).toBeNull();
  });

  it("suppresses the internal stat badges when hideStatBadges is set", () => {
    const buffed = { ...card, ap: 5, baseAp: 2 };
    const width = Math.round(CANONICAL_WIDTH * 0.8);
    const height = Math.round((1024 / 734) * width);
    const { queryByTestId } = render(
      <CardFace card={buffed} width={width} height={height} hideStatBadges />,
    );
    expect(queryByTestId("stat-current-badges")).toBeNull();
  });
});
