import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10EustassCaptainKid099, op10EustassCaptainKid112 } from "@tcg/op-cards";
import { op10TrafalgarLaw119 } from "../../../../../cards/src/cards/OP10/characters/119-trafalgar-law.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-119 Trafalgar Law", () => {
  test("moves a revealed Supernovas Character from hand to face-down Life before giving rested DON!!", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op10EustassCaptainKid099,
      hand: [op10TrafalgarLaw119, op10EustassCaptainKid112, eb01Doma005],
      life: [eb01Doma005],
      restedDon: 1,
      activeDon: op10TrafalgarLaw119.cost,
    });
    const kidId = engine.findCardInZone("south", "hand", op10EustassCaptainKid112);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard(op10TrafalgarLaw119, "south");
    const lifeTarget = engine.pendingDecision("effectRevealFromHandSelection", "south").steps[0];
    if (lifeTarget?.kind !== "selectEntity") throw new Error("Expected Law's hand-to-Life target.");
    expect(lifeTarget).toMatchObject({ min: 0, max: 1 });
    expect(lifeTarget.candidates.map((candidate) => candidate.ref.id)).toContain(kidId);
    engine.resolveDecision("effectRevealFromHandSelection", { selectedIds: [kidId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore + 1);
    expect(engine.getView("north").players.south.life[0]).toMatchObject({
      hidden: true,
      instanceId: null,
    });
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected Law's rested DON!! count.");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south.leader.attachedDon).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
