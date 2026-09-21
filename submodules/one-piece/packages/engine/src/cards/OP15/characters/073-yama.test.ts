import { describe, expect, test } from "vite-plus/test";
import { op15HeavenlyWarriors068 } from "../../../../../cards/src/cards/characters/op15-068-heavenly-warriors.ts";
import { op15Yama073 } from "../../../../../cards/src/cards/characters/op15-073-yama.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-073 Yama", () => {
  test("[On Play] plays a cost-1 Heavenly Warriors from hand", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Yama073, op15HeavenlyWarriors068], activeDon: 4 },
      {},
    );

    engine.playCard(op15Yama073);

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Yama's play choice.");
    expect(play.candidates).toHaveLength(1);
    const warriorId = engine.findCardInZone("south", "hand", op15HeavenlyWarriors068);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [warriorId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.instanceId === warriorId),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-073", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-073",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
