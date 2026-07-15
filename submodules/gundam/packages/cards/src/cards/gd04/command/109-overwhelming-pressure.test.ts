import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04OverwhelmingPressure109 } from "./109-overwhelming-pressure.ts";

describe("Overwhelming Pressure (GD04-109)", () => {
  it("【Main】deals 4 damage to a chosen enemy Unit that is Lv.6 or lower", () => {
    const enemy = createMockUnit({ name: "Level 6 Target", level: 6, hp: 6 });
    const engine = GundamTestEngine.create(
      { hand: [gd04OverwhelmingPressure109], resourceArea: activeResources(5) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(commandId, { targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(4);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("【Action】can be played through the end-phase action window", () => {
    const enemy = createMockUnit({ name: "Action Target", level: 6, hp: 6 });
    const engine = GundamTestEngine.create(
      { hand: [gd04OverwhelmingPressure109], resourceArea: activeResources(5) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(commandId, { targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(4);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot choose an enemy Unit above Lv.6", () => {
    const enemy = createMockUnit({ name: "Level 7 Unit", level: 7, hp: 6 });
    const engine = GundamTestEngine.create(
      { hand: [gd04OverwhelmingPressure109], resourceArea: activeResources(5) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectFailure(p1.playCommand(commandId, { targets: [enemyId] }), "INVALID_TARGET");

    expect(p2.getDamage(enemyId)).toBe(0);
    expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
  });
});
