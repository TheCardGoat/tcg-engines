import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import {
  eb01OffWhite019,
  eb01MountainGod018,
  op10Franky090,
  op10RoronoaZoro095,
  op10TonyTonyChopper087,
} from "@tcg/op-cards";

import { registerCards } from "../../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../index.ts";

const effectKoFranky: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-OP10-090-KO",
  canonicalId: "TEST-OP10-090-KO",
  name: "Franky Effect K.O. Test",
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

registerCards([effectKoFranky]);

describe("OP10-090 Franky", () => {
  test("blocks an attack, then on battle K.O. plays an included cost-3-or-less Dressrosa Character rested", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op10Franky090],
        trash: [op10TonyTonyChopper087, op10RoronoaZoro095],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const frankyId = engine.findCardInZone("south", "character", op10Franky090);
    const eligibleId = engine.findCardInZone("south", "trash", op10TonyTonyChopper087);
    const expensiveId = engine.findCardInZone("south", "trash", op10RoronoaZoro095);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Franky's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(frankyId);
    engine.resolveDecision("battleBlocker", { selectedIds: [frankyId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Franky's trash play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(frankyId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("after effect K.O. also plays an eligible Dressrosa Character rested", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Franky090], trash: [op10TonyTonyChopper087] },
      { hand: [effectKoFranky] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const frankyId = engine.findCardInZone("south", "character", op10Franky090);
    const eligibleId = engine.findCardInZone("south", "trash", op10TonyTonyChopper087);

    engine.playCard(effectKoFranky, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [frankyId] }, "north");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(frankyId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
