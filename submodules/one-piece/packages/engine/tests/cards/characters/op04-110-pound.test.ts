import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04Pound110,
  op04Trebol030,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-110 Pound", () => {
  test("blocks, then puts an eligible opposing Character in bottom Life face-up on battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Pound110] },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005],
        life: [eb01Fourtricks025],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const poundId = engine.findCardInZone("south", "character", op04Pound110);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [poundId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Pound's Life target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");
    engine.resolveDecision("effectLifePosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.north.life.at(-1)).toBe(eligibleId);
    expect(engine.getState().cards[eligibleId]?.faceUp).toBe(true);
  });

  test("on effect K.O. may choose no opposing Character without a position prompt", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04Pound110, rested: true }] },
      { hand: [op04Trebol030], character: [eb01Doma005], activeDon: op04Trebol030.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const poundId = engine.findCardInZone("south", "character", op04Pound110);
    const lifeBefore = engine.getView("south").players.north.lifeCount;
    engine.playCard(op04Trebol030, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [poundId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
