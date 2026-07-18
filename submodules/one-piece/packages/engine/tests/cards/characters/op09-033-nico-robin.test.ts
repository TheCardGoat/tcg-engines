import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb01Sanji014,
  eb01MountainGod018,
  op09NicoRobin033,
  op09TrafalgarLaw030,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const koByEffect: EventCard = {
  id: "TEST-OP09-033-KO-BY-EFFECT",
  canonicalId: "TEST-OP09-033-KO-BY-EFFECT",
  slug: "test-op09-033-ko-by-effect",
  name: "K.O. by Effect",
  printings: [],
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "TEST",
  cost: 0,
  traits: [],
  effect: "[Main] K.O. up to 1 of your opponent's Characters.",
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
  i18n: { en: { name: "K.O. by Effect" } },
};

registerCards([koByEffect]);

function koTarget(engine: OnePieceTestEngine, targetId: string) {
  engine.playCard(koByEffect, "north");
  const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
  expect(target?.kind).toBe("selectEntity");
  if (target?.kind !== "selectEntity") throw new Error("Expected the effect K.O. target.");
  expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
  engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");
}

describe("OP09-033 Nico Robin", () => {
  test("with two rested Characters protects either eligible trait, not other traits, through the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09NicoRobin033],
        character: [
          { card: op09TrafalgarLaw030, rested: true },
          { card: eb01Sanji014, rested: true },
          eb01Doma005,
        ],
        deck: [eb01Doma005, eb01Doma005],
        activeDon: op09NicoRobin033.cost,
      },
      {
        hand: [koByEffect, koByEffect, koByEffect, koByEffect],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const odysseyId = engine.findCardInZone("south", "character", op09TrafalgarLaw030);
    const strawHatId = engine.findCardInZone("south", "character", eb01Sanji014);
    const wrongTraitId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op09NicoRobin033, "south");
    engine.endTurn("south");

    engine.playCard(koByEffect, "north");
    const protectedTarget = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(protectedTarget?.kind).toBe("selectEntity");
    if (protectedTarget?.kind !== "selectEntity") {
      throw new Error("Expected the filtered effect K.O. target.");
    }
    const candidateIds = protectedTarget.candidates.map((candidate) => candidate.ref.id);
    expect(candidateIds).not.toContain(odysseyId);
    expect(candidateIds).not.toContain(strawHatId);
    expect(candidateIds).toContain(wrongTraitId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [wrongTraitId] }, "north");

    let view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === odysseyId)).toBe(true);
    expect(view.players.south.characters.some((card) => card?.instanceId === strawHatId)).toBe(
      true,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(wrongTraitId);

    engine.endTurn("north");
    engine.endTurn("south");
    koTarget(engine, odysseyId);

    view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(odysseyId);
    expect(view.players.south.characters.some((card) => card?.instanceId === strawHatId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not grant protection with fewer than two rested Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09NicoRobin033],
        character: [{ card: op09TrafalgarLaw030, rested: true }, eb01Doma005],
        deck: [eb01Doma005, eb01Doma005],
        activeDon: op09NicoRobin033.cost,
      },
      { hand: [koByEffect], deck: [eb01Doma005, eb01Doma005] },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("south", "character", op09TrafalgarLaw030);

    engine.playCard(op09NicoRobin033, "south");
    engine.endTurn("south");
    koTarget(engine, targetId);

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });

  test("does not prevent an eligible Character from being K.O.'d in battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09NicoRobin033],
        character: [
          { card: op09TrafalgarLaw030, rested: true },
          { card: eb01Sanji014, rested: true },
        ],
        deck: [eb01Doma005, eb01Doma005],
        activeDon: op09NicoRobin033.cost,
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("south", "character", op09TrafalgarLaw030);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op09NicoRobin033, "south");
    engine.endTurn("south");
    engine.declareAttack(attackerId, targetId, "north");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });
});
