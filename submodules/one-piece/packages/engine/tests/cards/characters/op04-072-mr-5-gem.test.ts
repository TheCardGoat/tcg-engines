import { describe, expect, test } from "vite-plus/test";
import { eb01Fourtricks025, eb01MountainGod018, op04Franky063, op04Mr5Gem072 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-072 Mr.5 (Gem)", () => {
  test("pays DON!! -2 and rests itself to K.O. only an opposing cost-4-or-less Character once", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Mr5Gem072], activeDon: 2 },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
          op04Franky063,
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const mr5Id = engine.findCardInZone("south", "character", op04Mr5Gem072);
    const firstAttackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const secondAttackerId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const eligibleId = engine.findCardInZone("north", "character", op04Franky063);

    engine.declareAttack(firstAttackerId, engine.leader("south"), "north");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Mr.5's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(firstAttackerId);
    expect(engine.getView("south").players.south.activeDon).toBe(0);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === mr5Id)
        ?.rested,
    ).toBe(true);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      eligibleId,
    );
    engine.declareAttack(secondAttackerId, engine.leader("south"), "north");
    expect(() => engine.pendingDecision("effectOptional", "south")).toThrow();
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may pay the costs and choose zero opposing Characters", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Mr5Gem072], activeDon: 2 },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op04Franky063],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const mr5Id = engine.findCardInZone("south", "character", op04Mr5Gem072);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("north", "character", op04Franky063);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.characters.find((card) => card?.instanceId === mr5Id)?.rested).toBe(
      true,
    );
    expect(
      engine
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === eligibleId),
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("declining pays nothing and does not spend the once-per-turn effect", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Mr5Gem072], activeDon: 2 },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
          op04Franky063,
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const mr5Id = engine.findCardInZone("south", "character", op04Mr5Gem072);
    const firstAttackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const secondAttackerId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const eligibleId = engine.findCardInZone("north", "character", op04Franky063);

    engine.declareAttack(firstAttackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(2);
    expect(view.players.south.characters.find((card) => card?.instanceId === mr5Id)?.rested).toBe(
      false,
    );
    expect(
      engine
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === eligibleId),
    ).toBe(true);

    engine.declareAttack(secondAttackerId, engine.leader("south"), "north");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer the effect when DON!! -2 cannot be paid", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Mr5Gem072], activeDon: 1 },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op04Franky063],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const mr5Id = engine.findCardInZone("south", "character", op04Mr5Gem072);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("north", "character", op04Franky063);

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    expect(() => engine.pendingDecision("effectOptional", "south")).toThrow();
    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(1);
    expect(view.players.south.characters.find((card) => card?.instanceId === mr5Id)?.rested).toBe(
      false,
    );
    expect(
      engine
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === eligibleId),
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
