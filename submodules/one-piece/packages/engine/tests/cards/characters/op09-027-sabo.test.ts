import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op09Sabo027 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const reactivateSabo: EventCard = {
  id: "TEST-OP09-027-REACTIVATE",
  canonicalId: "TEST-OP09-027-REACTIVATE",
  slug: "test-op09-027-reactivate",
  name: "Reactivate Sabo",
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
  i18n: { en: { name: "Reactivate Sabo" } },
};

registerCards([reactivateSabo]);

describe("OP09-027 Sabo", () => {
  test("counts itself after attacking, draws with three rested Characters, and draws only once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [reactivateSabo],
        character: [
          { card: op09Sabo027, playedOnTurn: 0 },
          { card: eb01Doma005, rested: true },
          { card: eb01Fourtricks025, rested: true },
        ],
        deck: [eb01MountainGod018, eb01Doma005],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const saboId = engine.findCardInZone("south", "character", op09Sabo027);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01MountainGod018);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(saboId, engine.leader("north"), "south");

    let view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(firstDrawId);
    expect(view.players.south.deckCount).toBe(deckBefore - 1);

    engine.playCard(reactivateSabo, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [saboId] }, "south");
    engine.declareAttack(saboId, engine.leader("north"), "south");

    view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore - 1);
    expect(view.players.south.hand).toHaveLength(1);
    expect(view.prompts).toHaveLength(0);
  });
});
