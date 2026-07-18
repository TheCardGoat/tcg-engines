import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01RoronoaZoro001,
  op05BeloBetty002,
  op05Lindbergh017,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-017 Lindbergh", () => {
  test("with 7000 power, K.O.s only an opposing Character with 3000 power or less", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Lindbergh017, attachedDon: 2, playedOnTurn: 0 }] },
      {
        character: [
          { card: eb01Doma005, rested: true, playedOnTurn: 0 },
          { card: eb01MountainGod018, rested: true, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lindberghId = engine.findCardInZone("south", "character", op05Lindbergh017);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const ineligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(lindberghId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Lindbergh's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(ineligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("below 7000 power, does not offer the When Attacking K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Lindbergh017, playedOnTurn: 0 }] },
      { character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lindberghId = engine.findCardInZone("south", "character", op05Lindbergh017);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(lindberghId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger pays a hand-trash cost and plays the physical card with a multicolored Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op05BeloBetty002,
        life: [op05Lindbergh017],
        hand: [eb01Doma005, eb01Fourtricks025],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const lindberghId = engine.findCardInZone("north", "life", op05Lindbergh017);
    const discardId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "north").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Lindbergh's hand-trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(discardId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === lindberghId)).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(lindberghId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger may pay its cost but does not play the card with a monocolored Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op01RoronoaZoro001,
        life: [op05Lindbergh017],
        hand: [eb01Doma005, eb01Fourtricks025],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const lindberghId = engine.findCardInZone("north", "life", op05Lindbergh017);
    const discardId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === lindberghId)).toBe(
      false,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([discardId, lindberghId]),
    );
    expect(view.prompts).toHaveLength(0);
  });
});
