import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op16BlackVortex115,
  op16DocQ109,
  op16GumGumTwinJetPistol039,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

// Teach's characters rest so they are legal attack targets; Doc Q carries the
// {Blackbeard Pirates} trait while Luffy (OP16-095) is the non-Blackbeard
// victim. Yamato (OP16-096) is the misleading non-Trigger hand card.
const SOUTH_TEAM = {
  leaderCardId: "OP16-080",
  character: [
    { card: op16DocQ109, rested: true, playedOnTurn: 0 },
    { cardId: "OP16-095", rested: true, playedOnTurn: 0 },
  ],
  hand: [op16GumGumTwinJetPistol039, "OP16-096", op16BlackVortex115],
  life: 2,
};

const NORTH_TEAM = {
  character: [
    { card: eb01Doma005, playedOnTurn: 0 },
    { cardId: "OP13-013", playedOnTurn: 0 },
  ],
};

const OPPONENTS_TURN = { firstPlayer: "south", activeSeat: "north" } as const;

describe("OP16-080 Marshall.D.Teach", () => {
  test("during the opponent's turn all of its Characters show +1 cost, back to base on its own turn", () => {
    const engine = OnePieceTestEngine.create(SOUTH_TEAM, NORTH_TEAM, OPPONENTS_TURN);
    const docQId = engine.findCardInZone("south", "character", op16DocQ109);
    const luffyId = engine.findCardInZone("south", "character", "OP16-095");
    const costOf = (id: string) =>
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === id)?.cost;

    expect(costOf(docQId)).toBe(2);
    expect(costOf(luffyId)).toBe(3);

    engine.endTurn("north");
    expect(costOf(docQId)).toBe(1);
    expect(costOf(luffyId)).toBe(2);
  });

  test("may trash a Trigger card to change an opposing attack to its Leader or a Blackbeard Pirates Character", () => {
    const engine = OnePieceTestEngine.create(SOUTH_TEAM, NORTH_TEAM, OPPONENTS_TURN);
    const docQId = engine.findCardInZone("south", "character", op16DocQ109);
    const luffyId = engine.findCardInZone("south", "character", "OP16-095");
    const firstTriggerId = engine.findCardInZone("south", "hand", op16GumGumTwinJetPistol039);
    const secondTriggerId = engine.findCardInZone("south", "hand", op16BlackVortex115);
    const misleadingId = engine.findCardInZone("south", "hand", "OP16-096");
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, luffyId, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(payment?.kind).toBe("payCost");
    if (payment?.kind !== "payCost") throw new Error("Expected the Trigger-card cost.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstTriggerId,
      secondTriggerId,
    ]);
    expect(payment.candidates.map((candidate) => candidate.ref.id)).not.toContain(misleadingId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [firstTriggerId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected the retarget choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      docQId,
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(2);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(luffyId);
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(firstTriggerId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(firstTriggerId);
    expect(view.prompts).toHaveLength(0);
  });

  test("declining leaves the attack on its original target and the hand unchanged", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-080",
        character: [
          { card: op16DocQ109, rested: true, playedOnTurn: 0 },
          { cardId: "OP16-095", rested: true, playedOnTurn: 0 },
        ],
        hand: [op16GumGumTwinJetPistol039, "OP16-096", op16BlackVortex115],
        life: 2,
      },
      NORTH_TEAM,
      OPPONENTS_TURN,
    );
    const luffyId = engine.findCardInZone("south", "character", "OP16-095");
    const triggerId = engine.findCardInZone("south", "hand", op16GumGumTwinJetPistol039);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, luffyId, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(luffyId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(luffyId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(triggerId);
    expect(view.prompts).toHaveLength(0);
  });

  test("retargets only once per turn", () => {
    const engine = OnePieceTestEngine.create(SOUTH_TEAM, NORTH_TEAM, OPPONENTS_TURN);
    const firstTriggerId = engine.findCardInZone("south", "hand", op16GumGumTwinJetPistol039);
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.declareAttack(domaId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (payment?.kind !== "payCost") throw new Error("Expected the Trigger-card cost.");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [firstTriggerId] }, "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    engine.declareAttack(higumaId, engine.leader("south"), "north");
    // The once-per-turn limit consumed the retarget, so the only prompt is the
    // defender's ordinary Counter step — no Teach optional and no trash cost.
    const prompts = engine.getView("south").prompts;
    expect(prompts).toHaveLength(1);
    expect(prompts[0]?.details).toContain("counter cards or pass");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
