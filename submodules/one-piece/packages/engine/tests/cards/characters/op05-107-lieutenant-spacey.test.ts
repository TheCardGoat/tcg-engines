import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard, EventCard } from "@tcg/op-types";
import {
  eb01Doma005,
  op05LieutenantSpacey107,
  op05MonkeyDLuffy060,
  op06Reject116,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const triggerToHand: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP05-107-TRIGGER-TO-HAND",
  canonicalId: "TEST-OP05-107-TRIGGER-TO-HAND",
  name: "Test Trigger to Hand",
  trigger: "Add this card to your hand.",
  effect: "[Trigger] Add this card to your hand.",
  effects: { effects: [{ trigger: "trigger", actions: [{ action: "addThisCardToHand" }] }] },
};

const selfDamage: EventCard = {
  ...op06Reject116,
  id: "TEST-OP05-107-SELF-DAMAGE",
  canonicalId: "TEST-OP05-107-SELF-DAMAGE",
  name: "Test Self Damage",
  cost: 0,
  effects: {
    effects: [{ trigger: "main", actions: [{ action: "dealDamage", player: "self", amount: 1 }] }],
  },
};
registerCards([triggerToHand, selfDamage]);

function spaceyPower(engine: OnePieceTestEngine, instanceId: string) {
  return engine
    .getView("south")
    .players.south.characters.find((card) => card?.instanceId === instanceId)?.power;
}

describe("OP05-107 Lieutenant Spacey", () => {
  test("gains +2000 once when Life is added directly to hand and expires after the turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op05MonkeyDLuffy060,
      character: [op05LieutenantSpacey107],
      life: [eb01Doma005, eb01Doma005],
    });
    const spaceyId = engine.findCardInZone("south", "character", op05LieutenantSpacey107);
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectAddDon", { optionId: "0" }, "south");
    expect(spaceyPower(engine, spaceyId)).toBe(6000);
    engine.endTurn("south");
    expect(spaceyPower(engine, spaceyId)).toBe(4000);
  });

  test("does not trigger when a Life Trigger stages through resolution before entering hand", () => {
    const engine = OnePieceTestEngine.create({
      character: [op05LieutenantSpacey107],
      hand: [selfDamage],
      life: [triggerToHand],
    });
    const spaceyId = engine.findCardInZone("south", "character", op05LieutenantSpacey107);
    const triggerId = engine.findCardInZone("south", "life", triggerToHand);
    engine.playCard(selfDamage, "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      triggerId,
    );
    expect(spaceyPower(engine, spaceyId)).toBe(4000);
  });

  test("triggers when the player declines a Life Trigger and adds it to hand", () => {
    const engine = OnePieceTestEngine.create({
      character: [op05LieutenantSpacey107],
      hand: [selfDamage],
      life: [triggerToHand],
    });
    const spaceyId = engine.findCardInZone("south", "character", op05LieutenantSpacey107);
    const triggerId = engine.findCardInZone("south", "life", triggerToHand);

    engine.playCard(selfDamage, "south");
    engine.resolveDecision("lifeTrigger", { optionId: "skip" }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      triggerId,
    );
    expect(spaceyPower(engine, spaceyId)).toBe(6000);
  });
});
