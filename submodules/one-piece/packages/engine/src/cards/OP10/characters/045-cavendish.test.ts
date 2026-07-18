import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { op10Cavendish045 } from "../../../../../cards/src/cards/OP10/characters/045-cavendish.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-045 Cavendish", () => {
  test("when attacking draws two, then trashes one chosen hand card", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op10Cavendish045, playedOnTurn: 0 }],
        hand: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const cavendishId = engine.findCardInZone("south", "character", op10Cavendish045);
    engine.declareAttack(cavendishId, engine.leader("north"), "south");
    const discard = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (discard?.kind !== "selectEntity") throw new Error("Expected Cavendish's discard.");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [discard.candidates[0]!.ref.id] },
      "south",
    );
    expect(engine.getView("south").players.south.hand).toHaveLength(2);
  });
});
