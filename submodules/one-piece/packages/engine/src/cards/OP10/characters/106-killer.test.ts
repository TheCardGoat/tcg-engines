import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Shanks120, op07JewelryBonney019 } from "@tcg/op-cards";
import { op10Killer106 } from "../../../../../cards/src/cards/OP10/characters/106-killer.ts";
import { op10Urouge101 } from "../../../../../cards/src/cards/OP10/characters/101-urouge.ts";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-106 Killer", () => {
  test("on K.O. finds either included Supernovas or Kid Pirates and orders the rest", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07JewelryBonney019,
        character: [{ card: op10Killer106, rested: true }],
        deck: [op10Urouge101, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const killerId = engine.findCardInZone("south", "character", op10Killer106);
    const eligibleId = engine.findCardInZone("south", "deck", op10Urouge101);
    engine.declareAttack(
      engine.findCardInZone("north", "character", op01Shanks120),
      killerId,
      "north",
    );
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Killer's search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
  });
});
