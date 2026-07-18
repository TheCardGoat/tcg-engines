import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op05ORobi063, op05UsoHachi061 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-063 O-Robi", () => {
  test("with eight DON!! cards on the field, K.O.s only an opposing cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op05ORobi063], activeDon: 8 },
      { character: [op05UsoHachi061, eb01MountainGod018] },
    );
    const eligibleId = engine.findCardInZone("north", "character", op05UsoHachi061);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op05ORobi063, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected O-Robi's K.O. choice.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(eligibleId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(expensiveId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not K.O. a Character with only seven DON!! cards on the field", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op05ORobi063], activeDon: 7 },
      { character: [op05UsoHachi061] },
    );
    const targetId = engine.findCardInZone("north", "character", op05UsoHachi061);

    engine.playCard(op05ORobi063, "south");

    expect(() => engine.pendingDecision("effectTargetSelection", "south")).toThrow();
    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(targetId);
  });
});
