import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op02Komille097, op04Eric022 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-022 Eric", () => {
  test("rests itself to rest only an active opposing cost-1-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op04Eric022, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
          { card: op02Komille097, playedOnTurn: 0, rested: true },
        ],
      },
    );
    const ericId = engine.findCardInZone("south", "character", op04Eric022);
    const ownCostOneId = engine.findCardInZone("south", "character", eb01Doma005);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const alreadyRestedId = engine.findCardInZone("north", "character", op02Komille097);

    engine.activateEffect(ericId, "activateMain", "south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south");
    expect(target.actorId).toBe("south");
    const step = target.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected Eric's rest target.");
    expect(step).toMatchObject({ min: 0, max: 1 });
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(ownCostOneId);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(alreadyRestedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === ericId)?.rested).toBe(
      true,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === ownCostOneId)?.rested,
    ).toBe(false);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay the self-rest cost and choose no opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04Eric022, playedOnTurn: 0 }] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
    );
    const ericId = engine.findCardInZone("south", "character", op04Eric022);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.activateEffect(ericId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === ericId)?.rested).toBe(
      true,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without resting itself or an opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04Eric022, playedOnTurn: 0 }] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
    );
    const ericId = engine.findCardInZone("south", "character", op04Eric022);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.activateEffect(ericId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === ericId)?.rested).toBe(
      false,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
