import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01OffWhite019,
  op01XDrake054,
  op02Borsalino114,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const ownKoEvent: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-OP02-114-OWN-KO",
  canonicalId: "TEST-OP02-114-OWN-KO",
  name: "Own-Turn K.O. Review",
  cost: 0,
  effect: "[Main] K.O. up to 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
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
};

registerCards([ownKoEvent]);

describe("OP02-114 Borsalino", () => {
  test("gains +1000 on the opponent's turn, blocks, and can still be K.O.'d in battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op02Borsalino114] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const borsalinoId = engine.findCardInZone("south", "character", op02Borsalino114);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === borsalinoId)?.power,
    ).toBe(6000);
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Borsalino's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(borsalinoId);
    engine.resolveDecision("battleBlocker", { selectedIds: [borsalinoId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(borsalinoId);
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
  });

  test("cannot be K.O.'d by an effect on the opponent's turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01XDrake054],
        activeDon: op01XDrake054.cost,
      },
      {
        character: [
          { card: op02Borsalino114, rested: true },
          { card: eb01Doma005, rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const borsalinoId = engine.findCardInZone("north", "character", op02Borsalino114);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op01XDrake054, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected X.Drake's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(borsalinoId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === borsalinoId)).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(borsalinoId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("has base power and can be K.O.'d by an effect on its controller's turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [ownKoEvent],
        character: [{ card: op02Borsalino114, playedOnTurn: 0 }],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const borsalinoId = engine.findCardInZone("south", "character", op02Borsalino114);

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === borsalinoId)?.power,
    ).toBe(5000);

    engine.playCard(ownKoEvent, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [borsalinoId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      borsalinoId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
