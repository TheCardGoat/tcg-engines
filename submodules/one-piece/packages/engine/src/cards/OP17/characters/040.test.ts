import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-040 Edward.Newgate", () => {
  test("On Play draws one card", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP17-040"], activeDon: 6 }, {});
    const deck = engine.getView("south").players.south.deckCount;
    engine.playCard("OP17-040");
    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(engine.getView("south").players.south.deckCount).toBe(deck - 1);
  });

  test("pays one card to boost an attacking Rocks Leader for this battle", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP17-039", character: ["OP17-040"], hand: ["EB01-005"] },
      { hand: ["EB01-005"] },
    );
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    // Choose Xebec first, preserving the intended order.
    const order = engine.pendingDecision("readyEffectOrder", "south").steps[0];
    if (order?.kind !== "chooseOption") throw new Error("Expected ready-effect order");
    const selected = order.options.find((option) => option.targetId === engine.leader("south"));
    if (!selected) throw new Error("Expected the intended ready effect");
    engine.resolveDecision("readyEffectOrder", { optionId: selected.id }, "south");
    // Decline Xebec's own draw ability, then pay Newgate's separate ability.
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.leader.power).toBe(8000);
    expect(engine.getView("south").players.south.hand).toHaveLength(0);
    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toEqual(["EB01-005"]);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
  });

  test("boosts an attacked Rocks Leader only once in the opponent's turn", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP17-039", character: ["OP17-040"], hand: ["EB01-005", "EB01-005"] },
      { character: ["EB01-018"] },
      { activeSeat: "north" },
    );
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected trash cost");
    engine.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: [cost.candidates[0]!.ref.id] },
      "south",
    );
    expect(engine.getView("south").players.south.leader.power).toBe(8000);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
    engine.declareAttack(
      engine.findCardInZone("north", "character", "EB01-018"),
      engine.leader("south"),
      "north",
    );
    expect(engine.pendingDecision("battleCounter", "south").actorId).toBe("south");
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
    expect(engine.getView("south").players.south.trash).toHaveLength(1);
  });

  test("does not trigger for the wrong Leader or a Character being attacked", () => {
    for (const targetLeader of [true, false]) {
      const engine = OnePieceTestEngine.create(
        {
          leaderCardId: targetLeader ? "OP13-001" : "OP17-039",
          character: [{ cardId: "OP17-040", rested: true }],
          hand: ["EB01-005"],
        },
        {},
        { activeSeat: "north" },
      );
      engine.declareAttack(
        engine.leader("north"),
        targetLeader
          ? engine.leader("south")
          : engine.findCardInZone("south", "character", "OP17-040"),
        "north",
      );
      expect(engine.pendingDecision("battleCounter", "south").actorId).toBe("south");
      expect(engine.getView("south").players.south.hand).toHaveLength(1);
      expect(engine.getView("south").players.south.leader.power).toBe(5000);
    }
  });

  test("does not trigger when a friendly Character attacks", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP17-039", character: ["OP17-040"], hand: ["EB01-005"] },
      { hand: ["EB01-005"] },
    );
    engine.declareAttack(
      engine.findCardInZone("south", "character", "OP17-040"),
      engine.leader("north"),
      "south",
    );
    expect(engine.pendingDecision("battleCounter", "north").actorId).toBe("north");
    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
  });
  test("may decline without discarding or increasing Leader power", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP17-039", character: ["OP17-040"], hand: ["EB01-005"] },
      {},
      { activeSeat: "north" },
    );
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(engine.pendingDecision("battleCounter", "south").actorId).toBe("south");
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(engine.getView("south").players.south.trash).toHaveLength(0);
  });
});
