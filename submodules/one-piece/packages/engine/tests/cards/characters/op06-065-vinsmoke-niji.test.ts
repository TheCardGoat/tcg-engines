import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06VinsmokeNiji065,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-065 Vinsmoke Niji", () => {
  test("at equal DON!!, chooses the K.O. branch for only a cost-2-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06VinsmokeNiji065], activeDon: 5 },
      { character: [eb01Doma005, eb01Fourtricks025], activeDon: 5 },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op06VinsmokeNiji065, "south");
    const choice = engine.pendingDecision("effectActionChoice", "south").steps[0];
    expect(choice?.kind).toBe("chooseOption");
    if (choice?.kind !== "chooseOption") throw new Error("Expected Niji's On Play choice.");
    expect(choice.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Niji's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      eligibleId,
    );
  });

  test("at equal DON!!, chooses the return branch for only a cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06VinsmokeNiji065], activeDon: 5 },
      { character: [eb01Fourtricks025, eb01MountainGod018], activeDon: 5 },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const handBefore = engine.getView("south").players.north.handCount;

    engine.playCard(op06VinsmokeNiji065, "south");
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Niji's return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(eligibleId);
    expect(view.players.north.handCount).toBe(handBefore + 1);
  });

  test("above the opponent's DON!! count, offers neither removal branch", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06VinsmokeNiji065], activeDon: 6 },
      { character: [eb01Doma005] },
    );
    const untouchedId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op06VinsmokeNiji065, "south");

    const view = engine.getView("south");
    expect(view.prompts).toHaveLength(0);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(untouchedId);
  });
});
