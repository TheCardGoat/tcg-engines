import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op15BobbyFunk050 } from "../../../../../cards/src/cards/characters/op15-050-bobby-funk.ts";
import { op15KellyFunk043 } from "../../../../../cards/src/cards/characters/op15-043-kelly-funk.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-043 Kelly Funk", () => {
  test("[On Play] plays a Bobby Funk from hand", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15KellyFunk043, op15BobbyFunk050, eb01Doma005], activeDon: 7 },
      {},
    );

    engine.playCard(op15KellyFunk043);

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Kelly's play choice.");
    const bobbyId = engine.findCardInZone("south", "hand", op15BobbyFunk050);
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([bobbyId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [bobbyId] }, "south");

    expect(
      engine.getView("south").players.south.characters.some((card) => card?.instanceId === bobbyId),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-043", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-043",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
