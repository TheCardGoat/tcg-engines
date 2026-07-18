import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op09BonkPunch010, op09Monster012 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-010 Bonk Punch", () => {
  test("plays up to 1 Monster from hand on play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09BonkPunch010, op09Monster012, eb01Doma005],
      activeDon: op09BonkPunch010.cost,
    });
    const monsterId = engine.findCardInZone("south", "hand", op09Monster012);
    const unrelatedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op09BonkPunch010, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Bonk Punch's Monster choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([monsterId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(unrelatedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [monsterId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === monsterId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("with DON!! x1 gains 2000 power when attacking for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op09BonkPunch010, playedOnTurn: 0 }], activeDon: 1 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bonkPunchId = engine.findCardInZone("south", "character", op09BonkPunch010);

    engine.attachDon(bonkPunchId, 1, "south");
    engine.declareAttack(bonkPunchId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === bonkPunchId),
    ).toMatchObject({
      attachedDon: 1,
      power: 8000,
    });
    expect(view.prompts).toHaveLength(0);
  });
});
