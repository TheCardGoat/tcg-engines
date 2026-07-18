import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op03Jango028, op03Sham027 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-028 Jango", () => {
  test("first choice sets an included East Blue cost-6-or-less Character active", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Jango028],
      activeDon: op03Jango028.cost,
      character: [
        { card: op03Sham027, rested: true },
        { card: eb01Doma005, rested: true },
      ],
    });
    const shamId = engine.findCardInZone("south", "character", op03Sham027);
    const nonEastBlueId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op03Jango028, "south");
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Jango's active selection.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(shamId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonEastBlueId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [shamId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === shamId)
        ?.rested,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("second choice must rest Jango and permit resting up to one opponent Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op03Jango028], activeDon: op03Jango028.cost },
      { character: [eb01Doma005] },
    );
    const jangoId = engine.findCardInZone("south", "hand", op03Jango028);
    const opponentId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op03Jango028, "south");
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === jangoId)
        ?.rested,
    ).toBe(true);
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity")
      throw new Error("Expected Jango's opponent rest selection.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(opponentId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opponentId] }, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === opponentId)?.rested,
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
