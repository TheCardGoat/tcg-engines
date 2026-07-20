import { op13Otama043, op14eb04Humandrill032 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Buffalo070 } from "../../../../../cards/src/cards/OP14EB04/characters/070-buffalo.ts";

import { OnePieceTestEngine } from "../../../index.ts";

function restBuffaloByOpponentCharacterEffect(engine: OnePieceTestEngine, buffaloId: string) {
  const humandrillId = engine.findCardInZone("north", "character", op14eb04Humandrill032);
  engine.declareAttack(humandrillId, engine.leader("south"), "north");
  const rest = engine.pendingDecision("effectTargetSelection", "north").steps[0];
  if (rest?.kind !== "selectEntity") throw new Error("Expected Humandrill's rest target.");
  expect(rest.candidates.map((candidate) => candidate.ref.id)).toContain(buffaloId);
  engine.resolveDecision("effectTargetSelection", { selectedIds: [buffaloId] }, "north");
}

describe("OP14-070 Buffalo", () => {
  test("may return one physical DON after an opposing Character effect rests it, then becomes active", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04Buffalo070],
        activeDon: 1,
        donDeckCount: 9,
      },
      { character: [{ card: op14eb04Humandrill032, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const buffaloId = engine.findCardInZone("south", "character", op14eb04Buffalo070);

    restBuffaloByOpponentCharacterEffect(engine, buffaloId);
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, donDeckCount: 10 });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === buffaloId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning a DON or setting itself active", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04Buffalo070],
        activeDon: 1,
        donDeckCount: 9,
      },
      { character: [{ card: op14eb04Humandrill032, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const buffaloId = engine.findCardInZone("south", "character", op14eb04Buffalo070);

    restBuffaloByOpponentCharacterEffect(engine, buffaloId);
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, donDeckCount: 9 });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === buffaloId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("rests as a Blocker without triggering its opponent-Character-effect reaction", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04Buffalo070],
        activeDon: 1,
        donDeckCount: 9,
      },
      { character: [{ card: op13Otama043, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const buffaloId = engine.findCardInZone("south", "character", op14eb04Buffalo070);
    const attackerId = engine.findCardInZone("north", "character", op13Otama043);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Buffalo's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(buffaloId);
    engine.resolveDecision("battleBlocker", { selectedIds: [buffaloId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south).toMatchObject({ activeDon: 1, donDeckCount: 9 });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === buffaloId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
