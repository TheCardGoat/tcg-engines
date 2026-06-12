import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd04Inspector112 } from "../command/112-inspector.ts";
import { gd04UnicornGundamAwakened066 } from "./066-unicorn-gundam-awakened.ts";

describe("Unicorn Gundam (Awakened) (GD04-066)", () => {
  it("has its printed keyword effects", () => {
    expect(gd04UnicornGundamAwakened066.keywordEffects.map((effect) => effect.keyword)).toEqual([
      "Suppression",
    ]);
  });

  it("applies AP-2 to a chosen enemy Unit after you activate a Command Main effect", () => {
    const enemyA = createMockUnit({ name: "Enemy A", level: 4, ap: 5, hp: 5 });
    const enemyB = createMockUnit({ name: "Enemy B", level: 4, ap: 5, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04Inspector112],
        play: [gd04UnicornGundamAwakened066],
        resourceArea: activeResources(4),
      },
      { play: [enemyA, enemyB] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [enemyAId, enemyBId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(gd04Inspector112));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    expect(getEffectiveStats(enemyAId!, engine.getG(), framework.cards, framework).ap).toBe(3);
    expect(getEffectiveStats(enemyBId!, engine.getG(), framework.cards, framework).ap).toBe(5);
  });

  it("does not trigger from an opponent's Command effect", () => {
    const enemy = createMockUnit({ name: "Enemy", level: 4, ap: 5, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd04UnicornGundamAwakened066] },
      {
        hand: [gd04Inspector112],
        play: [enemy],
        resourceArea: activeResources(4),
      },
    );
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    engine.getState().ctx.status.activePlayer = PLAYER_TWO as PlayerId;

    expectSuccess(p2.playCommand(gd04Inspector112));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    expect(getEffectiveStats(enemyId, engine.getG(), framework.cards, framework).ap).toBe(5);
  });
});
