import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op09MonkeyDLuffy036 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-036 Monkey.D.Luffy", () => {
  test("offers one mixed selection containing opposing DON!! and cost-6-or-less Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09MonkeyDLuffy036],
        activeDon: op09MonkeyDLuffy036.cost,
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01Doma005, rested: true },
        ],
      },
      { activeDon: 1, character: [eb01Doma005] },
    );
    const characterId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op09MonkeyDLuffy036, "south");
    const target = engine.pendingDecision("effectMixedRestSelection", "south").steps[0];
    if (target?.kind !== "payCost") throw new Error("Expected Luffy's mixed rest selection.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(characterId);
    expect(
      target.candidates.some((candidate) => candidate.ref.id.startsWith("active-don:north:")),
    ).toBe(true);
    engine.resolveDecision("effectMixedRestSelection", { selectedIds: [characterId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === characterId)?.rested,
    ).toBe(true);
    expect(view.players.north.activeDon).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
