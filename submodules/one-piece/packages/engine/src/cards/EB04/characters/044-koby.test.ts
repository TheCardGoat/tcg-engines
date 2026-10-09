import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb04Koby044 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

const OPPONENTS_TURN = { firstPlayer: "south", activeSeat: "north" } as const;

describe("EB04-044 Koby", () => {
  test("a Former Navy Leader permits the replacement because its type includes Navy", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP02-072",
        character: [{ card: eb04Koby044, rested: true }],
        hand: ["OP16-096"],
      },
      { character: [{ cardId: "OP16-096", playedOnTurn: 0 }] },
      OPPONENTS_TURN,
    );
    const koby = engine.findCardInZone("south", "character", eb04Koby044);
    const payment = engine.findCardInZone("south", "hand", "OP16-096");
    engine.asNorth().attack("OP16-096", koby);
    engine.asSouth().chooseCounter();
    engine.resolveDecision("battleKoReplacement", { selectedIds: [payment] }, "south");
    const view = engine.getView("south");
    expect(view.players.south.characters.map((c) => c?.instanceId)).toContain(koby);
    expect(view.players.south.trash.map((c) => c.instanceId)).toContain(payment);
    expect(view.players.south.handCount).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("under a {Navy} Leader shares one replacement across removal events, once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-060",
        character: [{ card: eb04Koby044, rested: true }],
        hand: ["OP16-096", "OP16-039"],
        activeDon: 2,
      },
      {
        character: [
          { cardId: "OP16-096", rested: false, playedOnTurn: 0 },
          { cardId: "OP16-096", rested: false, playedOnTurn: 0 },
        ],
      },
      OPPONENTS_TURN,
    );
    const kobyId = engine.findCardInZone("south", "character", eb04Koby044);
    const discardId = engine.findCardInZone("south", "hand", "OP16-096");
    const attackerId = engine.findCardInZone("north", "character", "OP16-096");

    engine.declareAttack(attackerId, kobyId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("battleKoReplacement", { selectedIds: [discardId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(kobyId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([
      engine.findCardInZone("south", "hand", "OP16-039"),
    ]);
    expect(view.prompts).toHaveLength(0);

    const nextAttacker = view.players.north.characters.find(
      (card) => card && card.instanceId !== attackerId,
    );
    if (!nextAttacker?.instanceId) throw new Error("Expected the second attacker.");
    engine.declareAttack(nextAttacker.instanceId, kobyId, "north");
    // No usable Counter remains, so the Counter Step ends automatically.
    const afterSecondAttack = engine.getView("south");
    expect(afterSecondAttack.players.south.trash.map((card) => card.instanceId)).toContain(kobyId);
    expect(afterSecondAttack.players.south.handCount).toBe(1);
    expect(afterSecondAttack.prompts).toHaveLength(0);
  });

  test("never opens under a non-{Navy} Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-001",
        character: [{ card: eb04Koby044, rested: true }],
        hand: ["OP16-096"],
        activeDon: 2,
      },
      { character: [{ cardId: "OP16-096", rested: false, playedOnTurn: 0 }] },
      OPPONENTS_TURN,
    );
    const kobyId = engine.findCardInZone("south", "character", eb04Koby044);
    const attackerId = engine.findCardInZone("north", "character", "OP16-096");

    engine.declareAttack(attackerId, kobyId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(kobyId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toHaveLength(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("draws 1 when an opposing Character is K.O.'d on its own turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-060",
        character: [{ card: eb04Koby044, playedOnTurn: 0 }],
        hand: [],
        deck: ["OP16-095", "OP16-096", "OP16-039"],
        activeDon: 3,
      },
      { character: [{ card: eb01Doma005, rested: true, attachedDon: 1 }] },
    );
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);

    // Mohji-style removal: attack isn't needed — use the Koby holder's own
    // battle. A 7000-power attacker vs a 3000 defender K.O.s it.
    engine.declareAttack(engine.findCardInZone("south", "character", eb04Koby044), domaId, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(1);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(domaId);
    expect(view.prompts).toHaveLength(0);
  });
});
