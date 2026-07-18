import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import { eb01MountainGod018, eb01OffWhite019, op07Capote063, op07Pickles069 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const koCharacter: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-OP07-069-KO",
  canonicalId: "TEST-OP07-069-KO",
  name: "Pickles Protection Review",
  cost: 0,
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
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

const koOwnCharacter: EventCard = {
  ...koCharacter,
  id: "TEST-OP07-069-OWN-KO",
  canonicalId: "TEST-OP07-069-OWN-KO",
  name: "Pickles Own-Effect Review",
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
registerCards([koCharacter, koOwnCharacter]);

describe("OP07-069 Pickles", () => {
  test("at equal DON!! protects other included Foxy Pirates from opponent-effect K.O., but not Pickles", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07Pickles069, op07Capote063], activeDon: 1 },
      { hand: [koCharacter], activeDon: 1 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const picklesId = engine.findCardInZone("south", "character", op07Pickles069);
    const protectedId = engine.findCardInZone("south", "character", op07Capote063);

    engine.playCard(koCharacter, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the opponent's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(picklesId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(protectedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [picklesId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(picklesId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(protectedId);
  });

  test("does not protect when its controller has more DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07Pickles069, op07Capote063], activeDon: 2 },
      { hand: [koCharacter], activeDon: 1 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const targetId = engine.findCardInZone("south", "character", op07Capote063);

    engine.playCard(koCharacter, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the opponent's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
  });

  test("does not protect another Foxy Pirates Character from its controller's own effect", () => {
    const engine = OnePieceTestEngine.create({
      hand: [koOwnCharacter],
      character: [op07Pickles069, op07Capote063],
      activeDon: 1,
    });
    const targetId = engine.findCardInZone("south", "character", op07Capote063);

    engine.playCard(koOwnCharacter, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the own-effect K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });

  test("does not prevent battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07Pickles069, { card: op07Capote063, rested: true }] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const targetId = engine.findCardInZone("south", "character", op07Capote063);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, targetId, "north");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });
});
