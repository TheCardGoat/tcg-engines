import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op01Kaido094, op04GumGumRedRoc056 } from "@tcg/op-cards";
import { op13StTopmanWarcury089 } from "../../../../../cards/src/cards/OP13/characters/089-st-topman-warcury.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-089 St. Topman Warcury", () => {
  test("at seven trash blocks publicly, can still be K.O.'d in battle, and draws one", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op13StTopmanWarcury089],
        trash: Array.from({ length: 7 }, () => eb01Fourtricks025),
        deck: [eb01Doma005, eb01Doma005],
      },
      { character: [{ card: op01Kaido094, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const warcuryId = engine.findCardInZone("south", "character", op13StTopmanWarcury089);
    const attackerId = engine.findCardInZone("north", "character", op01Kaido094);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Warcury's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(warcuryId);
    engine.resolveDecision("battleBlocker", { selectedIds: [warcuryId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(warcuryId);
    expect(view.players.south).toMatchObject({ handCount: 1, deckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("at seven trash is excluded from an opponent effect's removal targets", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op13StTopmanWarcury089, eb01Doma005],
        trash: Array.from({ length: 7 }, () => eb01Fourtricks025),
      },
      { hand: [op04GumGumRedRoc056], activeDon: op04GumGumRedRoc056.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const warcuryId = engine.findCardInZone("south", "character", op13StTopmanWarcury089);
    const removableId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op04GumGumRedRoc056, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Red Roc's removal target.");
    const candidates = target.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).not.toContain(warcuryId);
    expect(candidates).toContain(removableId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [removableId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(warcuryId);
    expect(engine.findCardInZone("south", "deck", eb01Doma005)).toBe(removableId);
    expect(view.prompts).toHaveLength(0);
  });
});
