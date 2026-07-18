import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02Blenheim012,
  op02Marco018,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-018 Marco", () => {
  test("blocks, pays an included Whitebeard Pirates hand cost on K.O., and replays itself rested at 2 Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        character: [{ card: op02Marco018, playedOnTurn: 0 }],
        hand: [eb01Doma005, op02Blenheim012, eb01MountainGod018],
        life: [eb01Doma005, eb01Fourtricks025],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const marcoId = engine.findCardInZone("north", "character", op02Marco018);
    const eligibleCostId = engine.findCardInZone("north", "hand", eb01Doma005);
    const otherEligibleCostId = engine.findCardInZone("north", "hand", op02Blenheim012);
    const ineligibleCostId = engine.findCardInZone("north", "hand", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [marcoId] }, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "north").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Marco's filtered hand cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleCostId);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(otherEligibleCostId);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleCostId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [eligibleCostId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.find((card) => card?.instanceId === marcoId)?.rested).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleCostId);
    expect(view.players.north.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([otherEligibleCostId, ineligibleCostId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may still pay the K.O. cost above 2 Life, but the post-cost self-play condition fails", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        character: [{ card: op02Marco018, playedOnTurn: 0 }],
        hand: [eb01Doma005],
        life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const marcoId = engine.findCardInZone("north", "character", op02Marco018);
    const costId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [marcoId] }, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === marcoId)).toBe(false);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([marcoId, costId]),
    );
    expect(view.prompts).toHaveLength(0);
  });
});
