import { describe, expect, test } from "vite-plus/test";
import { eb01Fourtricks025, eb01MountainGod018, op09JeanBart066 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-066 Jean Bart", () => {
  test("with fewer DON!! K.O.s only an opposing cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op09JeanBart066], activeDon: op09JeanBart066.cost },
      { activeDon: op09JeanBart066.cost + 1, character: [eb01Fourtricks025, eb01MountainGod018] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op09JeanBart066, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Jean Bart's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(expensiveId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not K.O. at equal DON!! field counts", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op09JeanBart066], activeDon: op09JeanBart066.cost },
      { activeDon: op09JeanBart066.cost, character: [eb01Fourtricks025] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op09JeanBart066, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});
