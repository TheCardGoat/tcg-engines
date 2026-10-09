import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-012 Benn.Beckman", () => {
  test("Blocker redirects a Leader attack and protects Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-012"], hand: [], life: 3 },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", "OP16-012");
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");
    expect(engine.getView("south").players.south.lifeCount).toBe(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] resting 1 DON!! plays a [Shanks] when the Leader qualifies with 10 DON!! on the field", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP09-001", hand: ["OP16-012", "OP16-006"], activeDon: 10 },
      {},
    );

    engine.playCard("OP16-012");
    engine.acceptLeadingOptional("south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Beckman's play choice.");
    const shanksId = play.candidates[0]!.ref.id;
    engine.resolveDecision("effectPlaySelection", { selectedIds: [shanksId] }, "south");
    // The effect-played Shanks' own On Play is optional: decline it.
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.map((card) => card?.cardId)).toContain("OP16-006");
    expect(south.hand.map((card) => card.cardId)).not.toContain("OP16-006");
    // Paying the play cost rests 5; resting the cost DON!! leaves 4 active + 6 rested.
    expect(south.activeDon).toBe(4);
    expect(south.restedDon).toBe(6);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("can decline its cost with a nonmatching Leader", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-012", "OP16-006"], activeDon: 10 }, {});

    engine.playCard("OP16-012");
    engine.asSouth().declineOptional();

    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toContain(
      "OP16-006",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without an active DON after play the optional cost is unavailable", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP09-001", hand: ["OP16-012", "OP16-006"], activeDon: 5 },
      {},
    );

    engine.playCard("OP16-012");

    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toContain(
      "OP16-006",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
