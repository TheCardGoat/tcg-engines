import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op09MarshallDTeach081 } from "@tcg/op-cards";
import { op09MarshallDTeach093 } from "../../../../../cards/src/cards/OP09/characters/093-marshall-d-teach.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-093 Marshall.D.Teach", () => {
  test("after the Leader choice, also offers a Character to negate and prevent from attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09MarshallDTeach081,
        character: [{ card: op09MarshallDTeach093, playedOnTurn: 1 }],
      },
      { character: [eb01Doma005] },
    );
    const teachId = engine.findCardInZone("south", "character", op09MarshallDTeach093);
    const opposingCharacterId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.activateEffect(teachId, "activateMain", "south");
    const leaderChoice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (leaderChoice?.kind !== "selectEntity")
      throw new Error("Expected the opposing Leader choice.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "south",
    );

    const characterChoice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (characterChoice?.kind !== "selectEntity") {
      throw new Error("Expected the printed second Character choice.");
    }
    expect(characterChoice.candidates.map((candidate) => candidate.ref.id)).toContain(
      opposingCharacterId,
    );
  });
});
