import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op02Koby098,
  op04CorridaColiseum096,
  op04Gyats080,
  op04Ideo077,
  op04Kyros082,
  op04Rebecca039,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-082 Kyros", () => {
  test("with Rebecca, K.O.'s cost 1 or less and trashes the exact top deck card", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04Rebecca039,
        hand: [op04Kyros082],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: op04Kyros082.cost,
      },
      { character: [op04Gyats080, op04Ideo077] },
    );
    const eligibleId = engine.findCardInZone("north", "character", op04Gyats080);
    const ineligibleId = engine.findCardInZone("north", "character", op04Ideo077);
    const topDeckId = engine.getState().players.south.deck[0]!;

    engine.playCard(op04Kyros082, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Kyros's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(topDeckId);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may rest either its Leader or Corrida Coliseum instead of an effect K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op04Kyros082],
        stage: op04CorridaColiseum096,
      },
      {
        hand: [op02Koby098, eb01Doma005],
        activeDon: op02Koby098.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kyrosId = engine.findCardInZone("south", "character", op04Kyros082);
    const stageId = engine.findCardInZone("south", "stage", op04CorridaColiseum096);

    engine.playCard(op02Koby098, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [kyrosId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    const payment = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(payment?.kind).toBe("selectEntity");
    if (payment?.kind !== "selectEntity") throw new Error("Expected Kyros's rest replacement.");
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), stageId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [stageId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === kyrosId)).toBe(true);
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.south.leader.rested).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline its unqualified battle K.O. replacement", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04Kyros082, rested: true }] },
      { character: [{ card: op04Ideo077, attachedDon: 3, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kyrosId = engine.findCardInZone("south", "character", op04Kyros082);
    const attackerId = engine.findCardInZone("north", "character", op04Ideo077);

    engine.declareAttack(attackerId, kyrosId, "north");
    engine.resolveDecision("battleKoReplacement", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      kyrosId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not replace another friendly Character's K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Kyros082, op04Gyats080] },
      {
        hand: [op02Koby098, eb01Doma005],
        activeDon: op02Koby098.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kyrosId = engine.findCardInZone("south", "character", op04Kyros082);
    const otherId = engine.findCardInZone("south", "character", op04Gyats080);

    engine.playCard(op02Koby098, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [otherId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(otherId);
    expect(view.players.south.characters.some((card) => card?.instanceId === kyrosId)).toBe(true);
    expect(view.decisions.some((decision) => decision.title.includes("replace the K.O."))).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
