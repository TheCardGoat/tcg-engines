import { eb01Doma005, op01MonkeyDLuffy003, op06Uta001, op09Shanks001 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13Koby025 } from "../../../../../cards/src/cards/OP13/characters/025-koby.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-025 Koby", () => {
  test("rests as a Blocker and retargets an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op13Koby025] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kobyId = engine.findCardInZone("south", "character", op13Koby025);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south");
    expect(blocker.actorId).toBe("south");
    const choice = blocker.steps[0];
    if (choice?.kind !== "selectEntity") throw new Error("Expected Koby's Blocker choice.");
    expect(choice.candidates.map((candidate) => candidate.ref.id)).toContain(kobyId);
    engine.resolveDecision("battleBlocker", { selectedIds: [kobyId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.characters.find((card) => card?.instanceId === kobyId)?.rested).toBe(
      true,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(kobyId);
    expect(view.prompts).toHaveLength(0);
  });

  test("with a FILM Leader, On Play offers to set a rested DON!! active", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06Uta001,
      hand: [op13Koby025],
      activeDon: op13Koby025.cost,
      restedDon: 1,
    });

    engine.playCard(op13Koby025, "south");
    const setActive = engine.pendingDecision("effectSetActiveDon", "south");
    expect(setActive.actorId).toBe("south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 1, restedDon: 5 });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("with a Strike Leader lacking FILM, On Play sets a rested DON!! active", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op01MonkeyDLuffy003,
      hand: [op13Koby025],
      activeDon: op13Koby025.cost,
      restedDon: 1,
    });

    engine.playCard(op13Koby025, "south");
    const setActive = engine.pendingDecision("effectSetActiveDon", "south");
    expect(setActive.actorId).toBe("south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 1, restedDon: 5 });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("with neither a FILM nor Strike Leader, On Play does not set DON!! active", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09Shanks001,
      hand: [op13Koby025],
      activeDon: op13Koby025.cost,
      restedDon: 1,
    });

    engine.playCard(op13Koby025, "south");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 6 });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
