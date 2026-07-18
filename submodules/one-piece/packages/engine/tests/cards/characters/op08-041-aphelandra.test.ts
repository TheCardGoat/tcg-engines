import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op07BoaHancock038,
  op08Aphelandra041,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-041 Aphelandra", () => {
  test("returns itself to hand before bottom-decking an opposing cost-1 Character", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op07BoaHancock038, character: [op08Aphelandra041] },
      { character: [eb01Doma005, eb01Fourtricks025] },
    );
    const sourceId = engine.findCardInZone("south", "character", op08Aphelandra041);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const deckBefore = engine.getView("north").players.north.deckCount;

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Aphelandra's deck target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(sourceId);
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(false);
    expect(view.players.north.deckCount).toBe(deckBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may return itself before the post-colon Leader condition fails", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op08Aphelandra041] },
      { character: [eb01Doma005] },
    );
    const sourceId = engine.findCardInZone("south", "character", op08Aphelandra041);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(sourceId);
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning itself", () => {
    const engine = OnePieceTestEngine.create({ character: [op08Aphelandra041] });
    const sourceId = engine.findCardInZone("south", "character", op08Aphelandra041);
    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.instanceId === sourceId),
    ).toBe(true);
  });
});
