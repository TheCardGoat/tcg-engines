import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02Koby098,
  op02Minokoala086,
  op02Saldeath074,
  op02Sengoku103,
  op02Smoker102,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-102 Smoker", () => {
  test("cannot be K.O.'d by an opponent's effect", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op02Smoker102, eb01Doma005] },
      {
        hand: [op02Koby098, eb01Doma005, eb01Fourtricks025],
        activeDon: op02Koby098.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const smokerId = engine.findCardInZone("south", "character", op02Smoker102);
    const eligibleId = engine.findCardInZone("south", "character", eb01Doma005);
    const discardedId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.playCard(op02Koby098, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardedId] }, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Koby's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(smokerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === smokerId)).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(smokerId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("is K.O.'d in battle despite its effect-K.O. protection", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op02Smoker102, rested: true, playedOnTurn: 0 }] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const smokerId = engine.findCardInZone("south", "character", op02Smoker102);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, smokerId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(smokerId);
    expect(view.prompts).toHaveLength(0);
  });

  test("gains +2000 only during a battle while any Character has cost 0", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op02Smoker102, playedOnTurn: 0 },
          { card: op02Sengoku103, attachedDon: 1, playedOnTurn: 0 },
        ],
      },
      {
        character: [{ card: op02Saldeath074, playedOnTurn: 0 }, op02Minokoala086],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const smokerId = engine.findCardInZone("south", "character", op02Smoker102);
    const saldeathId = engine.findCardInZone("north", "character", op02Saldeath074);
    const sengokuId = engine.findCardInZone("south", "character", op02Sengoku103);

    engine.declareAttack(sengokuId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [saldeathId] }, "south");
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "north");
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === saldeathId)?.cost,
    ).toBe(0);

    engine.declareAttack(smokerId, engine.leader("north"), "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === smokerId)
        ?.power,
    ).toBe(6000);
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "north");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === smokerId)
        ?.power,
    ).toBe(4000);
  });

  test("does not gain power when every Character has cost greater than 0", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op02Smoker102, playedOnTurn: 0 },
          { card: op02Sengoku103, playedOnTurn: 0 },
        ],
      },
      { hand: [eb01Doma005], character: [op02Minokoala086] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const smokerId = engine.findCardInZone("south", "character", op02Smoker102);

    engine.declareAttack(smokerId, engine.leader("north"), "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === smokerId)
        ?.power,
    ).toBe(4000);
  });
});
