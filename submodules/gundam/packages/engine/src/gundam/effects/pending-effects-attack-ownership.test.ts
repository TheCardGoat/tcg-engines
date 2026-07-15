/** Player-visible coverage for plain 【Attack】 trigger ownership. */

import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../index.ts";

const drawOnAttack: CardEffect = {
  type: "triggered",
  activation: { timing: ["attack"] },
  directives: [{ action: { action: "draw", count: 1 } }],
  sourceText: "【Attack】Draw 1.",
};

describe("Plain 【Attack】 trigger ownership", () => {
  it("activates the attacking Unit's ability without activating another Unit's ability", () => {
    const attacker = createMockUnit({ name: "Attacker", effects: [drawOnAttack] });
    const bystander = createMockUnit({ name: "Bystander", effects: [drawOnAttack] });
    const defender = createMockUnit({ name: "Defender" });
    const engine = GundamTestEngine.create(
      { play: [attacker, bystander], deck: 5 },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const defenderId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));

    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getCardsInZone("deck")).toHaveLength(4);
  });

  it("activates the attacking Unit's paired Pilot ability without activating a bystander", () => {
    const attacker = createMockUnit({ name: "Pilot's Unit" });
    const pilot = createMockPilot({ name: "Attack Pilot", effects: [drawOnAttack] });
    const bystander = createMockUnit({ name: "Bystander", effects: [drawOnAttack] });
    const defender = createMockUnit({ name: "Defender" });
    const engine = GundamTestEngine.create(
      {
        play: [attacker, bystander],
        hand: [pilot],
        resourceArea: activeResources(1),
        deck: 5,
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const defenderId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, attacker));
    expectSuccess(p1.enterBattle(attacker, defenderId));

    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getCardsInZone("deck")).toHaveLength(4);
  });

  it("does not activate a Pilot ability when a different Unit attacks", () => {
    const attacker = createMockUnit({ name: "Attacker" });
    const bystander = createMockUnit({ name: "Pilot's Unit" });
    const pilot = createMockPilot({ name: "Bystander Pilot", effects: [drawOnAttack] });
    const defender = createMockUnit({ name: "Defender" });
    const engine = GundamTestEngine.create(
      {
        play: [attacker, bystander],
        hand: [pilot],
        resourceArea: activeResources(1),
        deck: 5,
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const defenderId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, bystander));
    expectSuccess(p1.enterBattle(attacker, defenderId));

    expect(p1.getHand()).toHaveLength(0);
    expect(p1.getCardsInZone("deck")).toHaveLength(5);
  });
});
