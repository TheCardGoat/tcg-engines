import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op11CharlotteOven066 } from "../../../../../cards/src/cards/characters/op11-066-charlotte-oven.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-066 Charlotte Oven", () => {
  test("matching the revealed cost enables the K.O. and rested DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11CharlotteOven066], donDeckCount: 1 },
      { deck: [eb01Doma005, eb01MountainGod018], character: [eb01Doma005] },
    );
    const ovenId = engine.findCardInZone("south", "character", op11CharlotteOven066);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.activateEffect(ovenId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const guess = engine.pendingDecision("effectGuessTopDeckCost", "south").steps[0];
    expect(guess).toMatchObject({ kind: "chooseOption", min: 1, max: 1 });
    engine.resolveDecision("effectGuessTopDeckCost", { optionId: "1" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Oven's matching-cost K.O.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === ovenId)?.rested).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 0 });
    expect(view.logs.some((entry) => entry.message.includes(eb01Doma005.name))).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("a mismatched chosen cost skips both dependent actions", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11CharlotteOven066], donDeckCount: 1 },
      { deck: [eb01Doma005, eb01MountainGod018], character: [eb01Doma005] },
    );
    const ovenId = engine.findCardInZone("south", "character", op11CharlotteOven066);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.activateEffect(ovenId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectGuessTopDeckCost", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === ovenId)?.rested).toBe(
      true,
    );
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.players.south).toMatchObject({ restedDon: 0, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11CharlotteOven066], donDeckCount: 1 },
      { deck: [eb01Doma005, eb01MountainGod018], character: [eb01Doma005] },
    );
    const ovenId = engine.findCardInZone("south", "character", op11CharlotteOven066);
    engine.activateEffect(ovenId, "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
