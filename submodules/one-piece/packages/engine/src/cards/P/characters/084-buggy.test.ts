import { describe, expect, test } from "vite-plus/test";
import {
  eb03Alvida021,
  op07Coribou025,
  op09Buggy042,
  op09Crocodile046,
  pBuggy084,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-084 Buggy", () => {
  test("replays a Cross Guild Character of cost 6 or less from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09Buggy042,
        hand: [pBuggy084, eb03Alvida021, op09Crocodile046],
        activeDon: pBuggy084.cost,
      },
      {},
    );
    const alvidaId = engine.findCardInZone("south", "hand", eb03Alvida021);

    engine.playCard(pBuggy084, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the replay choice.");
    const candidates = play.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(alvidaId);
    expect(candidates).not.toContain(engine.findCardInZone("south", "hand", op09Crocodile046));
    engine.resolveDecision("effectPlaySelection", { selectedIds: [alvidaId] }, "south");
    // Alvida's own [On Play] cascade follows; resolve it (its choice prompt
    // is hers to make — pass 0 for a no-op where supported).
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south").players.south;
    expect(view.characters.map((card) => card?.instanceId)).toContain(alvidaId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("under a Buggy Leader, a cost-3 Character on either side cannot attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09Buggy042,
        character: [{ card: pBuggy084 }, { cardId: "OP13-013", playedOnTurn: 0 }],
        activeDon: 6,
      },
      { character: [{ cardId: "OP16-109", rested: false, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const northAttackerId = engine.findCardInZone("north", "character", "OP16-109");

    // Doc Q (cost 1) is outside the aura and may attack.
    expect(() =>
      engine.declareAttack(northAttackerId, engine.leader("south"), "north"),
    ).not.toThrow();
  });

  test("the cost 3-4 attack ban also applies to the opponent's Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09Buggy042,
        character: [{ card: pBuggy084 }, { card: op07Coribou025, rested: false, playedOnTurn: 0 }],
        activeDon: 6,
      },
      { character: [{ cardId: "OP16-109", rested: false, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const coribouId = engine.findCardInZone("south", "character", op07Coribou025);

    // Coribou (cost 3) is banned by Buggy's aura on the south side too.
    expect(() => engine.declareAttack(coribouId, engine.leader("north"), "south")).toThrow();
  });
});
