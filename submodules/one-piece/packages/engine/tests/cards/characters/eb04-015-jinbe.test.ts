import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op01JeanBart045,
  op01Shanks120,
  op06HodyJones020,
  op14eb04JinbeEb04015015,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-015 Jinbe", () => {
  test("blocks an opponent's attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04JinbeEb04015015] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const jinbeId = engine.findCardInZone("south", "character", op14eb04JinbeEb04015015);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [jinbeId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("when K.O.'d, rests one own card and plays only an eligible green Character with a Fish-Man Leader", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op06HodyJones020,
        hand: [op01JeanBart045],
        character: [{ card: op14eb04JinbeEb04015015, rested: true }, eb01Doma005],
      },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const jinbeId = engine.findCardInZone("south", "character", op14eb04JinbeEb04015015);
    const costId = engine.findCardInZone("south", "character", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", op01Shanks120);
    const playableId = engine.findCardInZone("south", "hand", op01JeanBart045);

    engine.declareAttack(attackerId, jinbeId, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostRestCards", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Jinbe's rest-card cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(costId);
    engine.resolveDecision("effectCostRestCards", { selectedIds: [costId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Jinbe's hand play selection.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([playableId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playableId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === costId)?.rested).toBe(
      true,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === playableId),
    ).toBeDefined();
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay the rest-card cost before the Leader-trait condition fails", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04JinbeEb04015015, rested: true }, eb01Doma005],
      },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const jinbeId = engine.findCardInZone("south", "character", op14eb04JinbeEb04015015);
    const costId = engine.findCardInZone("south", "character", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", op01Shanks120);

    engine.declareAttack(attackerId, jinbeId, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostRestCards", { selectedIds: [costId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === costId)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
