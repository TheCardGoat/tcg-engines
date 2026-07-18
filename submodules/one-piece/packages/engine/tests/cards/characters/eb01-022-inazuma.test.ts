import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Inazuma022 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-022 Inazuma", () => {
  test("draws 2 at the two-card hand boundary and not above it", () => {
    const eligible = OnePieceTestEngine.create({
      character: [eb01Inazuma022],
      hand: [eb01Doma005, eb01Doma005],
      deck: [eb01Doma005, eb01Doma005, eb01Doma005],
    });

    eligible.endTurn("south");
    expect(eligible.getView("south").players.south.hand).toHaveLength(4);
    expect(eligible.getView("south").players.south.deckCount).toBe(1);

    const ineligible = OnePieceTestEngine.create({
      character: [eb01Inazuma022],
      hand: [eb01Doma005, eb01Doma005, eb01Doma005],
      deck: [eb01Doma005, eb01Doma005, eb01Doma005],
    });

    ineligible.endTurn("south");
    expect(ineligible.getView("south").players.south.hand).toHaveLength(3);
    expect(ineligible.getView("south").players.south.deckCount).toBe(3);
    expect(eligible.getState().capabilityHistory).toHaveLength(0);
    expect(ineligible.getState().capabilityHistory).toHaveLength(0);
  });
});
