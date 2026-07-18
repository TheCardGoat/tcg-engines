import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op09Lindbergh114,
  op10Scotch008,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-114 Lindbergh", () => {
  test("Life Trigger plays its physical card and its On Play K.O.s an eligible opposing Character at five total Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op10Scotch008, rested: true },
        ],
        life: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      {
        life: [op09Lindbergh114],
        deck: [eb01Doma005, eb01Fourtricks025, eb01Doma005, eb01Fourtricks025],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", op10Scotch008);
    const lindberghId = engine.findCardInZone("north", "life", op09Lindbergh114);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Lindbergh's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(lindberghId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not K.O. when the players have more than five total Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09Lindbergh114],
        life: [eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: op09Lindbergh114.cost,
      },
      {
        character: [op10Scotch008],
        life: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
    );
    const targetId = engine.findCardInZone("north", "character", op10Scotch008);

    engine.playCard(op09Lindbergh114, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});
