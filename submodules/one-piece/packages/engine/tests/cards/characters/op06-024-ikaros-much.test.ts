import { describe, expect, test } from "vite-plus/test";
import {
  op06BearKing012,
  op06Hatchan031,
  op06HodyJones020,
  op06IkarosMuch024,
  op06Ratchet014,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-024 Ikaros Much", () => {
  test("with a New Fish-Man Pirates Leader plays an included cost-4 Fish-Man, then takes Life", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06HodyJones020,
      hand: [op06IkarosMuch024, op06Hatchan031, op06BearKing012],
      life: [op06Ratchet014],
      activeDon: 5,
    });
    const eligibleId = engine.findCardInZone("south", "hand", op06Hatchan031);
    const excludedId = engine.findCardInZone("south", "hand", op06BearKing012);
    const lifeId = engine.findCardInZone("south", "life", op06Ratchet014);

    engine.playCard(op06IkarosMuch024, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Ikaros Much's hand play.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === eligibleId)).toBe(
      true,
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.players.south.lifeCount).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("does nothing when the Leader lacks New Fish-Man Pirates", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06IkarosMuch024, op06Hatchan031],
      life: [op06Ratchet014],
      activeDon: 5,
    });
    const eligibleId = engine.findCardInZone("south", "hand", op06Hatchan031);
    const lifeId = engine.findCardInZone("south", "life", op06Ratchet014);

    engine.playCard(op06IkarosMuch024, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(lifeId);
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("still takes the top Life card when the optional play is declined", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06HodyJones020,
      hand: [op06IkarosMuch024, op06Hatchan031],
      life: [op06Ratchet014],
      activeDon: op06IkarosMuch024.cost,
    });
    const eligibleId = engine.findCardInZone("south", "hand", op06Hatchan031);
    const lifeId = engine.findCardInZone("south", "life", op06Ratchet014);

    engine.playCard(op06IkarosMuch024, "south");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.players.south.lifeCount).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });
});
