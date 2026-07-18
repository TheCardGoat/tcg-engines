import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op01Kaido094,
  op09Sanji028,
  op09TonyTonyChopper029,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-028 Sanji", () => {
  test("on K.O. pays with bottom Life, then plays an eligible trash Character rested", () => {
    const engine = OnePieceTestEngine.create(
      {
        life: [eb01Doma005, eb01Fourtricks025],
        character: [{ card: op09Sanji028, rested: true }],
        trash: [op09TonyTonyChopper029, eb01Doma005],
      },
      { character: [{ card: op01Kaido094, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sanjiId = engine.findCardInZone("south", "character", op09Sanji028);
    const attackerId = engine.findCardInZone("north", "character", op01Kaido094);
    const eligibleId = engine.findCardInZone("south", "trash", op09TonyTonyChopper029);
    const wrongTraitId = engine.findCardInZone("south", "trash", eb01Doma005);
    const bottomLifeId = engine.getState().players.south.life.at(-1)!;

    engine.declareAttack(attackerId, sanjiId, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const lifeCost = engine.pendingDecision("effectCostAddLifeToHand", "south").steps[0];
    expect(lifeCost?.kind).toBe("chooseOption");
    if (lifeCost?.kind !== "chooseOption") throw new Error("Expected Sanji's Life choice.");
    expect(lifeCost.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Sanji's trash play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(sanjiId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(bottomLifeId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sanjiId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline after K.O. without moving Life or playing from trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        life: [eb01Doma005, eb01Fourtricks025],
        character: [{ card: op09Sanji028, rested: true }],
        trash: [op09TonyTonyChopper029],
      },
      { character: [{ card: op01Kaido094, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sanjiId = engine.findCardInZone("south", "character", op09Sanji028);
    const attackerId = engine.findCardInZone("north", "character", op01Kaido094);
    const candidateId = engine.findCardInZone("south", "trash", op09TonyTonyChopper029);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, sanjiId, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([sanjiId, candidateId]),
    );
    expect(view.prompts).toHaveLength(0);
  });
});
