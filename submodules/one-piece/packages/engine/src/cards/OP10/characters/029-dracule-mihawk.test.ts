import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op09Sakazuki026,
  op10DraculeMihawk029,
  op10Franky034,
  op10Lim037,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-029 Dracule Mihawk", () => {
  test("with 2 rested Characters activates an included cost-5-or-less ODYSSEY Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10DraculeMihawk029],
      character: [
        { card: op10Franky034, rested: true },
        { card: op10Lim037, rested: true },
        { card: op09Sakazuki026, rested: true },
        { card: eb01Doma005, rested: true },
      ],
      activeDon: op10DraculeMihawk029.cost,
    });
    const frankyId = engine.findCardInZone("south", "character", op10Franky034);
    const limId = engine.findCardInZone("south", "character", op10Lim037);
    const expensiveId = engine.findCardInZone("south", "character", op09Sakazuki026);
    const wrongTraitId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op10DraculeMihawk029, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Mihawk's active target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([frankyId, limId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [frankyId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === frankyId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer an active target with fewer than 2 rested Characters", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10DraculeMihawk029],
      character: [{ card: op10Franky034, rested: true }, op10Lim037],
      activeDon: op10DraculeMihawk029.cost,
    });

    engine.playCard(op10DraculeMihawk029, "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.cardId === op10Franky034.id)?.rested,
    ).toBe(true);
  });
});
