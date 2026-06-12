// @vitest-environment jsdom
import { describe, expect, it, afterEach } from "vite-plus/test";
import { render, cleanup } from "@testing-library/react";

import { CardFace } from "./CardFace.tsx";
import type { GameCardData } from "../types.ts";

const CANONICAL_WIDTH = 734;

function renderFace(card: GameCardData, scale = 0.8) {
  const width = Math.round(CANONICAL_WIDTH * scale);
  const height = Math.round((1024 / 734) * width);
  return render(<CardFace card={card} width={width} height={height} />);
}

/**
 * Full-card diagonal-stripe overlay signals "cannot attack this turn"
 * per rule 3-2-4. Gated on `deployedThisTurn && canAttackThisTurn ===
 * false && cardType === 'unit'`. Link units (rule 3-2-6-3) are exempt —
 * they attack the turn they deploy, so `canAttackThisTurn === true`.
 */
describe("CardFace · deployed overlay", () => {
  afterEach(cleanup);

  const baseUnit: GameCardData = {
    id: "unit_1",
    name: "RX-78-2",
    cardType: "unit",
    ap: 2,
    hp: 3,
  };

  it("renders when a non-Link unit was deployed this turn", () => {
    const { queryByTestId } = renderFace({
      ...baseUnit,
      deployedThisTurn: true,
      canAttackThisTurn: false,
      isLinkUnit: false,
    });
    expect(queryByTestId("deployed-overlay")).not.toBeNull();
  });

  it("is hidden for Link units deployed this turn (can attack)", () => {
    const { queryByTestId } = renderFace({
      ...baseUnit,
      deployedThisTurn: true,
      canAttackThisTurn: true,
      isLinkUnit: true,
    });
    expect(queryByTestId("deployed-overlay")).toBeNull();
  });

  it("is hidden once the unit can attack (next turn)", () => {
    const { queryByTestId } = renderFace({
      ...baseUnit,
      deployedThisTurn: false,
      canAttackThisTurn: true,
    });
    expect(queryByTestId("deployed-overlay")).toBeNull();
  });

  it("is hidden for non-unit cards", () => {
    const { queryByTestId } = renderFace({
      ...baseUnit,
      cardType: "base",
      deployedThisTurn: true,
      canAttackThisTurn: false,
    });
    expect(queryByTestId("deployed-overlay")).toBeNull();
  });
});
