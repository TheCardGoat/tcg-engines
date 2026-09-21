import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

const SOUTH_TEAM = {
  leaderCardId: "OP17-001",
  character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }],
  hand: ["OP16-096", "OP16-109"],
  life: 2,
};

const NORTH_TEAM = {
  character: [
    { card: eb01Doma005, playedOnTurn: 0 },
    { cardId: "OP13-013", playedOnTurn: 0 },
  ],
};

const OPPONENTS_TURN = { firstPlayer: "south", activeSeat: "north" } as const;

const powerOf = (engine: OnePieceTestEngine, id: string) =>
  engine.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.power;

describe("OP17-001 Edward.Newgate", () => {
  test("trashes a hand card to give up to 1 Leader or Character +4000 for this battle", () => {
    const engine = OnePieceTestEngine.create(SOUTH_TEAM, NORTH_TEAM, OPPONENTS_TURN);
    const defenderId = engine.findCardInZone("south", "character", eb01Doma005);
    const handId = engine.findCardInZone("south", "hand", "OP16-096");
    const secondHandId = engine.findCardInZone("south", "hand", "OP16-109");
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    expect(powerOf(engine, defenderId)).toBe(3000);

    engine.declareAttack(attackerId, defenderId, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected the hand-trash cost.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual([handId, secondHandId]);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [handId] }, "south");

    const boost = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(boost?.kind).toBe("selectEntity");
    if (boost?.kind !== "selectEntity") throw new Error("Expected the boost target choice.");
    expect(boost.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      defenderId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [defenderId] }, "south");

    // The defender now out-powers the attacker for this battle only.
    expect(powerOf(engine, defenderId)).toBe(7000);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    // 7-1-4-2: the losing attacker is unharmed; the boosted defender survives
    // a battle it would have tied (and been K.O.'d in) without the boost.
    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(defenderId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(attackerId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual([handId]);
    expect(powerOf(engine, defenderId)).toBe(3000);
    expect(view.prompts).toHaveLength(0);
  });

  test("declining leaves the hand untouched and the battle unresolved by the Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-001",
        character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }],
        hand: ["OP16-096", "OP16-109"],
        life: 2,
      },
      { leaderCardId: "OP13-001", character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      OPPONENTS_TURN,
    );
    const leaderId = engine.leader("south");
    const handId = engine.findCardInZone("south", "hand", "OP16-096");
    const secondHandId = engine.findCardInZone("south", "hand", "OP16-109");
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, leaderId, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader?.power).toBe(5000);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([handId, secondHandId]);
    expect(view.players.south.lifeCount).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });

  test("activates only once per turn", () => {
    const engine = OnePieceTestEngine.create(SOUTH_TEAM, NORTH_TEAM, OPPONENTS_TURN);
    const leaderId = engine.leader("south");
    const handId = engine.findCardInZone("south", "hand", "OP16-096");
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, leaderId, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [handId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "south");
    expect(engine.getView("south").players.south.leader?.power).toBe(9000);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    // The battle-scoped boost expires with the battle.
    expect(engine.getView("south").players.south.leader?.power).toBe(5000);

    // North's second attacker, still in the same turn: the once-per-turn
    // limit consumed the Newgate window, so only the Counter step prompts.
    const secondAttackerId = engine.findCardInZone("north", "character", "OP13-013");
    engine.declareAttack(secondAttackerId, leaderId, "north");
    const prompts = engine.getView("south").prompts;
    expect(prompts).toHaveLength(1);
    expect(prompts[0]?.details).toContain("counter cards or pass");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(engine.getView("south").players.south.leader?.power).toBe(5000);
  });
});
