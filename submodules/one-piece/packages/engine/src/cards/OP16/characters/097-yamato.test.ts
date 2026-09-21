import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-097 Yamato", () => {
  test("[On Play] returns a LoW Character of cost 6 or less from trash to hand, then may play a cost-2-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-097", "EB01-005"], trash: ["OP16-091"], activeDon: 8 },
      {},
    );

    engine.playCard("OP16-097");
    const returnToHand = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (returnToHand?.kind !== "selectEntity") throw new Error("Expected the return choice.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [returnToHand.candidates[0]!.ref.id] },
      "south",
    );
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the play choice.");
    engine.resolveDecision(
      "effectPlaySelection",
      { selectedIds: [play.candidates[0]!.ref.id] },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.hand.map((card) => card.cardId)).toContain("OP16-091");
    expect(south.characters.map((card) => card?.cardId)).toContain("EB01-005");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-097", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP16-097",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
