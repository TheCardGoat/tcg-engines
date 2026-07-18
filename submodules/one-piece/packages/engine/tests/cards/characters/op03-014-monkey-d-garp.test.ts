import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01TonyTonyChopper006,
  op03Haruta009,
  op03MonkeyDGarp014,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-014 Monkey.D.Garp", () => {
  test("when attacking, plays only a red cost-1 Character from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03MonkeyDGarp014, playedOnTurn: 0 }],
        hand: [eb01Doma005, eb01TonyTonyChopper006, op03Haruta009],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const garpId = engine.findCardInZone("south", "character", op03MonkeyDGarp014);
    const eligibleId = engine.findCardInZone("south", "hand", eb01Doma005);
    const wrongColorId = engine.findCardInZone("south", "hand", eb01TonyTonyChopper006);
    const wrongCostId = engine.findCardInZone("south", "hand", op03Haruta009);

    engine.declareAttack(garpId, engine.leader("north"), "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Garp's hand-play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongColorId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongCostId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.instanceId === eligibleId),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
