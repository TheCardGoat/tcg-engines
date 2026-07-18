import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03NefeltariVivi001,
  op14eb04Igaram021,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-021 Igaram", () => {
  test("with Nefeltari Vivi, draws two and trashes one card from hand on play", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: eb03NefeltariVivi001,
      hand: [op14eb04Igaram021, eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: op14eb04Igaram021.cost,
    });
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnIds = [...engine.getState().players.south.deck].slice(0, 2);

    engine.playCard(op14eb04Igaram021, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Igaram's hand-trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([discardId, ...drawnIds]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(drawnIds),
    );
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("once per turn, trashes a hand card to give one rested DON!! to a Leader or Character", () => {
    const engine = OnePieceTestEngine.create({
      character: [op14eb04Igaram021, eb01Doma005],
      hand: [eb01Fourtricks025],
      restedDon: 1,
    });
    const igaramId = engine.findCardInZone("south", "character", op14eb04Igaram021);
    const discardId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(igaramId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.south.restedDon).toBe(0);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.attachedDon,
    ).toBe(1);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: igaramId,
        trigger: "activateMain",
      }).reason,
    ).toContain("already been used this turn");
  });
});
