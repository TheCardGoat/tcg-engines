import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op03CharlotteLinlin114,
  op04Hera111,
  op04Rabiyan113,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-111 Hera", () => {
  test("may trash another Hera as its Homies cost, rests itself, and sets Linlin active", () => {
    expect(op04Hera111.traits).toEqual(["Big Mom Pirates", "Homies"]);
    const engine = OnePieceTestEngine.create({
      character: [
        op04Hera111,
        op04Hera111,
        op04Rabiyan113,
        eb01Doma005,
        { card: op03CharlotteLinlin114, rested: true },
      ],
    });
    const heraIds = engine
      .getView("south")
      .players.south.characters.filter((card) => card?.cardId === op04Hera111.id)
      .map((card) => card!.instanceId);
    const sourceId = heraIds[0]!;
    const otherHeraId = heraIds[1]!;
    const rabiyanId = engine.findCardInZone("south", "character", op04Rabiyan113);
    const unrelatedId = engine.findCardInZone("south", "character", eb01Doma005);
    const linlinId = engine.findCardInZone("south", "character", op03CharlotteLinlin114);

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashCharacter", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Hera's Homies cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([otherHeraId, rabiyanId]),
    );
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(sourceId);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(unrelatedId);
    engine.resolveDecision("effectCostTrashCharacter", { selectedIds: [otherHeraId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Hera's Linlin target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([linlinId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [linlinId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(otherHeraId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === sourceId)?.rested,
    ).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === linlinId)?.rested,
    ).toBe(false);
  });

  test("cannot activate with only the source Hera available as Homies", () => {
    const engine = OnePieceTestEngine.create({ character: [op04Hera111] });
    const sourceId = engine.findCardInZone("south", "character", op04Hera111);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: sourceId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("plays the physical resolving Life Trigger card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op04Hera111] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op04Hera111);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(
      engine.getView("north").players.north.characters.map((card) => card?.instanceId),
    ).toContain(triggerId);
    expect(
      engine.getView("north").players.north.trash.map((card) => card.instanceId),
    ).not.toContain(triggerId);
  });
});
