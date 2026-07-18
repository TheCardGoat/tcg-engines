import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb01MountainGod018,
  op02Seaquake021,
  op03Fossa010,
  op03Marco013,
  op03MarshallDTeach012,
  op05Enel100,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const redCostReplacement: CharacterCard = {
  ...op05Enel100,
  id: "TEST-OP03-012-COST-REPLACEMENT",
  canonicalId: "TEST-OP03-012-COST-REPLACEMENT",
  name: "Test Red Cost Replacement",
  color: ["red"],
};
registerCards([redCostReplacement]);

describe("OP03-012 Marshall.D.Teach", () => {
  test("trashes only an eligible Character without firing On K.O., then draws and gains battle power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op03MarshallDTeach012, playedOnTurn: 0 },
          { card: op03Marco013, attachedDon: 2 },
          eb01Doma005,
          eb01MountainGod018,
        ],
        hand: [op02Seaquake021],
        deck: [eb01Doma005],
      },
      { character: [op03Fossa010] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const teachId = engine.findCardInZone("south", "character", op03MarshallDTeach012);
    const marcoId = engine.findCardInZone("south", "character", op03Marco013);
    const lowPowerId = engine.findCardInZone("south", "character", eb01Doma005);
    const nonRedId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("south", "hand", op02Seaquake021);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.declareAttack(teachId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostTrashCharacter", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Teach's Character-trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(teachId);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(marcoId);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(lowPowerId);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonRedId);
    engine.resolveDecision("effectCostTrashCharacter", { selectedIds: [marcoId] }, "south");

    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(marcoId);
    expect(view.players.south.restedDon).toBe(2);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, drawnId]),
    );
    expect(view.players.south.characters.find((card) => card?.instanceId === teachId)?.power).toBe(
      7000,
    );
    expect(engine.getView("north").prompts).toHaveLength(1);
  });

  test("may decline without trashing, drawing, or gaining power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03MarshallDTeach012, playedOnTurn: 0 }, op03Marco013],
        deck: [eb01Doma005],
      },
      { character: [op03Fossa010] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const teachId = engine.findCardInZone("south", "character", op03MarshallDTeach012);
    const marcoId = engine.findCardInZone("south", "character", op03Marco013);

    engine.declareAttack(teachId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === marcoId)).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(marcoId);
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.characters.find((card) => card?.instanceId === teachId)?.power).toBe(
      6000,
    );
  });

  test("ends the battle without damage when Teach trashes himself for the attack cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03MarshallDTeach012, playedOnTurn: 0 }],
        deck: [eb01Doma005],
      },
      { life: [eb01Doma005, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const teachId = engine.findCardInZone("south", "character", op03MarshallDTeach012);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.declareAttack(teachId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(teachId);
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().battle).toBeNull();
  });

  test("a leave-field replacement prevents the trash cost and cancels the dependent effect", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03MarshallDTeach012, playedOnTurn: 0 }, redCostReplacement],
        life: [eb01Doma005],
        deck: [eb01MountainGod018],
      },
      { character: [op03Fossa010] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const teachId = engine.findCardInZone("south", "character", op03MarshallDTeach012);
    const replacementId = engine.findCardInZone("south", "character", redCostReplacement);

    engine.declareAttack(teachId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashCharacter", { selectedIds: [replacementId] }, "south");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(replacementId);
    expect(view.players.south.lifeCount).toBe(0);
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.characters.find((card) => card?.instanceId === teachId)?.power).toBe(
      6000,
    );
    expect(engine.pendingDecision("battleBlocker", "north").steps).toHaveLength(1);
  });
});
