import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op03Zeff047 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-047 Zeff", () => {
  test("returns either player's cost-3-or-less Character, then may trash exactly two deck cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03Zeff047],
        character: [eb01Doma005],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: op03Zeff047.cost,
      },
      { character: [eb01Fourtricks025, eb01MountainGod018] },
    );
    const ownLowCostId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingLowCostId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const opposingHighCostId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op03Zeff047, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Zeff's return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownLowCostId, opposingLowCostId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      opposingHighCostId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingLowCostId] }, "south");

    const optionalTrash = engine.pendingDecision("effectActionOptional", "south").steps[0];
    expect(optionalTrash?.kind).toBe("confirm");
    engine.resolveDecision("effectActionOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.some((card) => card?.instanceId === opposingLowCostId),
    ).toBe(false);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      opposingLowCostId,
    );
    expect(view.players.south.trash).toHaveLength(2);
    expect(view.prompts).toHaveLength(0);
  });

  test("with DON attached, may trash exactly seven after dealing Life damage", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03Zeff047, playedOnTurn: 0, attachedDon: 1 }],
        deck: Array.from({ length: 8 }, () => eb01Doma005),
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const zeffId = engine.findCardInZone("south", "character", op03Zeff047);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.declareAttack(zeffId, engine.leader("north"), "south");

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    const optional = engine.pendingDecision("effectOptional", "south").steps[0];
    expect(optional?.kind).toBe("confirm");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.trash).toHaveLength(7);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the seven-card trash after an attached-DON attack deals Life damage", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03Zeff047, playedOnTurn: 0, attachedDon: 1 }],
        deck: Array.from({ length: 8 }, () => eb01Doma005),
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const zeffId = engine.findCardInZone("south", "character", op03Zeff047);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(zeffId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer the seven-card trash without attached DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op03Zeff047, playedOnTurn: 0 }],
        deck: Array.from({ length: 8 }, () => eb01Doma005),
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const zeffId = engine.findCardInZone("south", "character", op03Zeff047);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(zeffId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the two-card deck trash after its On Play return", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Zeff047],
      deck: [eb01Doma005, eb01Fourtricks025],
      activeDon: op03Zeff047.cost,
    });
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op03Zeff047, "south");
    engine.resolveDecision("effectActionOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});
