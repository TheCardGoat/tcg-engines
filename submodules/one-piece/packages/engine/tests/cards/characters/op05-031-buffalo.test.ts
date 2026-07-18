import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import { eb01Doma005, eb01Fourtricks025, op05Buffalo031 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const reactivateBuffalo: EventCard = {
  id: "TEST-OP05-031-REACTIVATE",
  canonicalId: "TEST-OP05-031-REACTIVATE",
  slug: "test-op05-031-reactivate",
  name: "Buffalo Once Per Turn Review",
  printings: [],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "TEST",
  cost: 0,
  traits: [],
  effect: "[Main] Set up to 1 of your Characters as active.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
          },
        ],
      },
    ],
  },
  i18n: { en: { name: "Buffalo Once Per Turn Review" } },
};

registerCards([reactivateBuffalo]);

describe("OP05-031 Buffalo", () => {
  test("with two rested Characters, reactivates only a rested cost-1 Character once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op05Buffalo031, playedOnTurn: 0 },
          { card: eb01Doma005, rested: true },
          { card: eb01Fourtricks025, rested: true },
        ],
        hand: [reactivateBuffalo],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const buffaloId = engine.findCardInZone("south", "character", op05Buffalo031);
    const eligibleId = engine.findCardInZone("south", "character", eb01Doma005);
    const wrongCostId = engine.findCardInZone("south", "character", eb01Fourtricks025);

    engine.declareAttack(buffaloId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Buffalo's active target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(false);

    engine.playCard(reactivateBuffalo, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [buffaloId] }, "south");
    engine.declareAttack(buffaloId, engine.leader("north"), "south");
    expect(() => engine.pendingDecision("effectTargetSelection", "south")).toThrow();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not activate when the attack leaves fewer than two rested Characters", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op05Buffalo031, playedOnTurn: 0 }] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const buffaloId = engine.findCardInZone("south", "character", op05Buffalo031);

    engine.declareAttack(buffaloId, engine.leader("north"), "south");

    expect(() => engine.pendingDecision("effectTargetSelection", "south")).toThrow();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
