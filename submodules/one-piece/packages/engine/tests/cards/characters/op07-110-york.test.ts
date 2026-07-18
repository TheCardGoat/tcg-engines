import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op07Vegapunk097,
  op07York110,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-110 York", () => {
  test("takes top or bottom Life as its optional cost, then K.O.s within cost 2", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07York110],
        life: [eb01Doma005, eb01Fourtricks025],
        activeDon: op07York110.cost,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const bottomLifeId = engine.getState().players.south.life.at(-1)!;
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op07York110, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostAddLifeToHand", "south").steps[0];
    expect(cost?.kind).toBe("chooseOption");
    if (cost?.kind !== "chooseOption") throw new Error("Expected York's Life cost.");
    expect(cost.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected York's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(bottomLifeId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(expensiveId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without taking Life or K.O.ing a Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07York110],
        life: [eb01Doma005],
        activeDon: op07York110.cost,
      },
      { character: [eb01Doma005] },
    );
    const lifeBefore = [...engine.getState().players.south.life];
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op07York110, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getState().players.south.life).toEqual(lifeBefore);
    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(opposingId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger plays the resolving physical card with a Vegapunk Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op07Vegapunk097,
        life: [op07York110, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const yorkId = engine.findCardInZone("north", "life", op07York110);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(yorkId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(yorkId);
    expect(view.prompts).toHaveLength(0);
  });
});
