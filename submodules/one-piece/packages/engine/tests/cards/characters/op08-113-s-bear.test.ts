import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op08SBear113 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-113 S-Bear", () => {
  test("at 2 or less Life trashes a hand card, plays itself from Trigger, then K.O.s cost 3", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
        ],
      },
      {
        hand: [eb01Doma005],
        life: [op08SBear113, eb01Fourtricks025],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const sBearId = engine.findCardInZone("north", "life", op08SBear113);
    const discardId = engine.findCardInZone("north", "hand", eb01Doma005);
    const eligibleId = engine.findCardInZone("south", "character", eb01Fourtricks025);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected S-Bear's K.O. choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(sBearId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("above 2 Life still pays the Trigger cost but neither plays itself nor K.O.s", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
        ],
      },
      {
        hand: [eb01Doma005],
        life: [op08SBear113, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const sBearId = engine.findCardInZone("north", "life", op08SBear113);
    const discardId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(sBearId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([sBearId, discardId]),
    );
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(attackerId);
    expect(view.prompts).toHaveLength(0);
  });
});
