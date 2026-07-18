import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op04Franky063, op04Yokozuna068 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-068 Yokozuna", () => {
  test("uses split traits and may bounce only cost-2-or-less before the Block Step", () => {
    expect(op04Yokozuna068.traits).toEqual(["Animal", "Water Seven"]);

    const engine = OnePieceTestEngine.create(
      { character: [op04Yokozuna068], activeDon: 1 },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op04Franky063, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const yokozunaId = engine.findCardInZone("south", "character", op04Yokozuna068);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("north", "character", op04Franky063);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Yokozuna's return target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const viewBeforeBlock = engine.getView("south");
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      eligibleId,
    );
    expect(viewBeforeBlock.players.south.activeDon).toBe(0);

    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Yokozuna's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(yokozunaId);
    engine.resolveDecision("battleBlocker", { selectedIds: [yokozunaId] }, "south");

    const viewAfterBlock = engine.getView("south");
    expect(viewAfterBlock.players.south.trash.map((card) => card.instanceId)).toContain(yokozunaId);
    expect(viewAfterBlock.players.south.lifeCount).toBe(viewBeforeBlock.players.south.lifeCount);
    expect(viewAfterBlock.prompts).toHaveLength(0);
  });

  test("may pay DON!! -1 and choose zero opposing Characters", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Yokozuna068], activeDon: 1 },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op04Franky063, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("north", "character", op04Franky063);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    expect(engine.getView("south").players.south.activeDon).toBe(0);
    expect(
      engine
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === eligibleId),
    ).toBe(true);
    expect(engine.pendingDecision("battleBlocker", "south").actorId).toBe("south");
    engine.resolveDecision("battleBlocker", { selectedIds: [] }, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline without returning DON!! or an opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Yokozuna068], activeDon: 1 },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op04Franky063, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("north", "character", op04Franky063);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(1);
    expect(view.players.north.characters.some((card) => card?.instanceId === eligibleId)).toBe(
      true,
    );
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(eligibleId);
    expect(engine.pendingDecision("battleBlocker", "south").actorId).toBe("south");
  });

  test("does not offer the attack effect when DON!! -1 cannot be paid", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Yokozuna068] },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op04Franky063, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const yokozunaId = engine.findCardInZone("south", "character", op04Yokozuna068);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("north", "character", op04Franky063);

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    expect(() => engine.pendingDecision("effectOptional", "south")).toThrow();
    expect(
      engine
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === eligibleId),
    ).toBe(true);
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Yokozuna's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(yokozunaId);
  });
});
