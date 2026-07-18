import { describe, expect, test } from "vite-plus/test";
import {
  op01RoronoaZoro025,
  op05ChopaEmon068,
  op05Jinbe066,
  op05MonkeyDLuffy119,
  op05TrafalgarLaw069,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-068 Chopa-Emon", () => {
  test("at eight DON!! after payment, reactivates an included purple Straw Hat Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05ChopaEmon068],
      character: [
        { card: op05Jinbe066, rested: true },
        { card: op05MonkeyDLuffy119, rested: true },
        { card: op05TrafalgarLaw069, rested: true },
        { card: op01RoronoaZoro025, rested: true },
      ],
      activeDon: 10,
    });
    const jinbeId = engine.findCardInZone("south", "character", op05Jinbe066);
    const highPowerId = engine.findCardInZone("south", "character", op05MonkeyDLuffy119);
    const wrongTraitId = engine.findCardInZone("south", "character", op05TrafalgarLaw069);
    const wrongColorId = engine.findCardInZone("south", "character", op01RoronoaZoro025);

    engine.playCard(op05ChopaEmon068, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Chopa-Emon's active target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(jinbeId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highPowerId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongColorId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [jinbeId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === jinbeId)?.rested).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("below eight DON!! after payment, does not reactivate a legal target", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05ChopaEmon068],
      character: [{ card: op05Jinbe066, rested: true }],
      activeDon: 7,
    });
    const jinbeId = engine.findCardInZone("south", "character", op05Jinbe066);

    engine.playCard(op05ChopaEmon068, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === jinbeId)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
