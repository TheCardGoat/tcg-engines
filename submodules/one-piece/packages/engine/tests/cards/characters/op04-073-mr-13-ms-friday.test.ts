import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op04MissValentineMikita066,
  op04Mr13MsFriday073,
  op04MsAllSunday064,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-073 Mr.13 & Ms.Friday", () => {
  test("has separate Animal and Baroque Works traits", () => {
    expect(op04Mr13MsFriday073.traits).toEqual(["Animal", "Baroque Works"]);
  });

  test("trashes itself and a distinct Baroque Works Character to add active DON!!", () => {
    const engine = OnePieceTestEngine.create({
      character: [op04Mr13MsFriday073, op04MsAllSunday064, op04MissValentineMikita066, eb01Doma005],
      donDeckCount: 1,
    });
    const sourceId = engine.findCardInZone("south", "character", op04Mr13MsFriday073);
    const sundayId = engine.findCardInZone("south", "character", op04MsAllSunday064);
    const mikitaId = engine.findCardInZone("south", "character", op04MissValentineMikita066);
    const domaId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostTrashCharacter", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected a Character-trash cost.");
    const candidates = cost.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toEqual(expect.arrayContaining([sundayId, mikitaId]));
    expect(candidates).not.toContain(sourceId);
    expect(candidates).not.toContain(domaId);
    engine.resolveDecision("effectCostTrashCharacter", { selectedIds: [sundayId] }, "south");

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") throw new Error("Expected an add-DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([sourceId, sundayId]),
    );
    expect(view.players.south.characters.map((card) => card?.instanceId)).toEqual(
      expect.arrayContaining([mikitaId, domaId]),
    );
    expect(view.players.south).toMatchObject({ activeDon: 1, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("cannot activate without a distinct Baroque Works Character", () => {
    const engine = OnePieceTestEngine.create({
      character: [op04Mr13MsFriday073],
      donDeckCount: 1,
    });
    const sourceId = engine.findCardInZone("south", "character", op04Mr13MsFriday073);

    const failure = engine.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: sourceId,
      trigger: "activateMain",
    });

    expect(failure.accepted).toBe(false);
    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(sourceId);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("plays the resolving physical Life Trigger card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op04Mr13MsFriday073] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op04Mr13MsFriday073);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(triggerId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(triggerId);
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(triggerId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
