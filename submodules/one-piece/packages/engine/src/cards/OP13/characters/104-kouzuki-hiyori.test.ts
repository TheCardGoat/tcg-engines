import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { op01RoronoaZoro001 } from "../../../../../cards/src/cards/OP01/leaders/001-roronoa-zoro.ts";
import { op13Sabo004 } from "../../../../../cards/src/cards/OP13/leaders/004-sabo.ts";
import { op13KouzukiHiyori104 } from "../../../../../cards/src/cards/OP13/characters/104-kouzuki-hiyori.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-104 Kouzuki Hiyori", () => {
  test("blocks for a multicolored Leader, then trashes a hand card to add the deck top to Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op13Sabo004,
        character: [op13KouzukiHiyori104],
        hand: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01MountainGod018, eb01Doma005],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hiyoriId = engine.findCardInZone("south", "character", op13KouzukiHiyori104);
    const paymentId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const deckTopId = engine.findCardInZone("south", "deck", eb01MountainGod018);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Hiyori's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(hiyoriId);
    engine.resolveDecision("battleBlocker", { selectedIds: [hiyoriId] }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Hiyori's hand-trash payment.");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore + 1);
    expect(engine.findCardInZone("south", "life", eb01MountainGod018)).toBe(deckTopId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([hiyoriId, paymentId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("with a monocolored Leader the paid On K.O. effect does not add Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01RoronoaZoro001,
        character: [{ card: op13KouzukiHiyori104, rested: true }],
        hand: [eb01Fourtricks025],
        deck: [eb01Doma005, eb01Doma005],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hiyoriId = engine.findCardInZone("south", "character", op13KouzukiHiyori104);
    const paymentId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, hiyoriId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([hiyoriId, paymentId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the On K.O. hand cost and Life addition", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op13Sabo004,
        character: [{ card: op13KouzukiHiyori104, rested: true }],
        hand: [eb01Fourtricks025],
        deck: [eb01Doma005, eb01Doma005],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hiyoriId = engine.findCardInZone("south", "character", op13KouzukiHiyori104);
    const paymentId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, hiyoriId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(hiyoriId);
    expect(view.prompts).toHaveLength(0);
  });
});
