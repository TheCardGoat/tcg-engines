import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op09Sakazuki026 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-026 Sakazuki", () => {
  test("with two rested Characters K.O.s only an opposing cost-5-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09Sakazuki026],
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01Fourtricks025, rested: true },
        ],
        activeDon: op09Sakazuki026.cost,
      },
      { character: [eb01MountainGod018, op09Sakazuki026] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const expensiveId = engine.findCardInZone("north", "character", op09Sakazuki026);

    engine.playCard(op09Sakazuki026, "south");

    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(ko).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (ko?.kind !== "selectEntity") throw new Error("Expected Sakazuki's K.O. target.");
    expect(ko.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(ko.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.some((card) => card?.instanceId === expensiveId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not K.O. with fewer than two rested Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09Sakazuki026],
        character: [{ card: eb01Doma005, rested: true }, eb01Fourtricks025],
        activeDon: op09Sakazuki026.cost,
      },
      { character: [eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op09Sakazuki026, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
