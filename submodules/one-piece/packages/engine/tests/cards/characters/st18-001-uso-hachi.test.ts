import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10UsoHachiSp001, op11ShanksSp004 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST18-001 Uso-Hachi", () => {
  test("with eight DON!! on its field, rests only an opposing cost-5-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op10UsoHachiSp001], activeDon: 8 },
      { character: [eb01Doma005, op11ShanksSp004] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", op11ShanksSp004);

    engine.playCard(op10UsoHachiSp001, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Uso-Hachi's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === expensiveId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer a rest target below eight DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op10UsoHachiSp001], activeDon: 7 },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op10UsoHachiSp001, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
