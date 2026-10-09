import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01OffWhite019,
  op08Thatch045,
  op05DonquixoteRosinante030,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const returnThatch: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-OP08-045-RETURN",
  canonicalId: "TEST-OP08-045-RETURN",
  name: "Thatch Removal Review",
  cost: 0,
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
            },
          },
        ],
      },
    ],
  },
};

registerCards([returnThatch]);

describe("OP08-045 Thatch", () => {
  test("automatically replaces opponent-effect removal by trashing itself and drawing", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op08Thatch045], deck: [eb01Doma005, eb01Doma005] },
      { hand: [returnThatch] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const thatchId = engine.findCardInZone("south", "character", op08Thatch045);
    const handBefore = engine.getView("south").players.south.handCount;

    engine.playCard(returnThatch, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [thatchId] }, "north");

    const view = engine.getView("south");
    expect(view.prompts).toHaveLength(0);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(thatchId);
    expect(view.players.south.handCount).toBe(handBefore + 1);
  });

  test("Thatch's mandatory replacement takes priority over other Characters' optional replacements", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op08Thatch045, rested: true },
          { card: op05DonquixoteRosinante030, rested: true },
          { card: op05DonquixoteRosinante030, rested: true },
        ],
        deck: [eb01Doma005, eb01Doma005],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const thatch = engine.findCardInZone("south", "character", op08Thatch045);
    engine.declareAttack(
      engine.findCardInZone("north", "character", eb01MountainGod018),
      thatch,
      "north",
    );
    const view = engine.getView("south");
    expect(view.prompts).toHaveLength(0);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual([thatch]);
    expect(
      view.players.south.characters.filter(
        (card) => card?.cardId === op05DonquixoteRosinante030.id,
      ),
    ).toHaveLength(2);
    expect(view.players.south.handCount).toBe(1);
  });

  test("automatically replaces battle K.O. by trashing itself and drawing", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op08Thatch045, rested: true }],
        deck: [eb01Doma005, eb01Doma005],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const thatchId = engine.findCardInZone("south", "character", op08Thatch045);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const handBefore = engine.getView("south").players.south.handCount;

    engine.declareAttack(attackerId, thatchId, "north");

    const view = engine.getView("south");
    expect(view.prompts).toHaveLength(0);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(thatchId);
    expect(view.players.south.handCount).toBe(handBefore + 1);
  });
  test("FAQ: replaced battle KO draws but does not trigger opposing Kaido KO reaction", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP01-061", character: ["ST15-002"], donDeckCount: 10 },
      { character: [{ cardId: "OP08-045", rested: true }], deck: ["ST02-012", "ST02-006"] },
    );
    const target = e.findCardInZone("north", "character", "OP08-045");
    e.asSouth().attack(e.findCardInZone("south", "character", "ST15-002"), target);
    expect(e.getView("north").players.north.hand.map((c) => c.cardId)).toEqual(["ST02-012"]);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("south").players.south.restedDon).toBe(0);
    expect(e.getView("south").players.south.donDeckCount).toBe(10);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
