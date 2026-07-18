import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import { eb01Doma005, eb01MountainGod018, op05Hakuba087, op05RikuDoldoIii090 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const compoundDressrosa: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP05-090-COMPOUND-DRESSROSA",
  canonicalId: "TEST-OP05-090-COMPOUND-DRESSROSA",
  name: "Compound Dressrosa Character",
  traits: ["Beautiful Pirates/Dressrosa"],
};
registerCards([compoundDressrosa]);

const koCharacter: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP05-090-KO-CHARACTER",
  canonicalId: "TEST-OP05-090-KO-CHARACTER",
  name: "Test K.O. Character",
  cost: 0,
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1 },
            },
          },
        ],
      },
    ],
  },
};
registerCards([koCharacter]);

function characterPower(engine: OnePieceTestEngine, instanceId: string) {
  return engine
    .getView("south")
    .players.south.characters.find((card) => card?.instanceId === instanceId)?.power;
}

describe("OP05-090 Riku Doldo III", () => {
  test("On Play buffs an included Dressrosa Character for this turn", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05RikuDoldoIii090],
      character: [compoundDressrosa, eb01Doma005],
      activeDon: 4,
    });
    const eligibleId = engine.findCardInZone("south", "character", compoundDressrosa);
    const unrelatedId = engine.findCardInZone("south", "character", eb01Doma005);
    engine.playCard(op05RikuDoldoIii090, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Riku's power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(unrelatedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");
    expect(characterPower(engine, eligibleId)).toBe((compoundDressrosa.power ?? 0) + 2000);
    engine.endTurn("south");
    expect(characterPower(engine, eligibleId)).toBe(compoundDressrosa.power);
  });

  test("On K.O. buffs a surviving included Dressrosa Character and remains optional", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05RikuDoldoIii090, compoundDressrosa] },
      { hand: [koCharacter] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const rikuId = engine.findCardInZone("south", "character", op05RikuDoldoIii090);
    const eligibleId = engine.findCardInZone("south", "character", compoundDressrosa);
    engine.playCard(koCharacter, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [rikuId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      rikuId,
    );
    expect(characterPower(engine, eligibleId)).toBe((compoundDressrosa.power ?? 0) + 2000);
  });

  test("blocks through the public battle choice", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05RikuDoldoIii090] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const rikuId = engine.findCardInZone("south", "character", op05RikuDoldoIii090);
    engine.declareAttack(
      engine.findCardInZone("north", "character", eb01MountainGod018),
      engine.leader("south"),
      "north",
    );
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Riku's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(rikuId);
  });

  test("On K.O. also buffs a Dressrosa Character after battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op05RikuDoldoIii090, rested: true },
          { card: op05Hakuba087, playedOnTurn: 0 },
        ],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const rikuId = engine.findCardInZone("south", "character", op05RikuDoldoIii090);
    const hakubaId = engine.findCardInZone("south", "character", op05Hakuba087);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, rikuId, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [hakubaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(rikuId);
    expect(view.players.south.characters.find((card) => card?.instanceId === hakubaId)?.power).toBe(
      8000,
    );
  });
});
