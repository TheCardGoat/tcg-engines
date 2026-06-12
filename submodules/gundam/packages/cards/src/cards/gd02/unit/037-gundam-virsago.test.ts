import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd02GundamVirsago037 } from "./037-gundam-virsago.ts";

describe("Gundam Virsago (GD02-037)", () => {
  it("data declares Breach 1 and deploy damage gated by 3-or-fewer enemy Shields", () => {
    expect(gd02GundamVirsago037.keywordEffects).toEqual([{ keyword: "Breach", value: 1 }]);
    expect(gd02GundamVirsago037.effects?.[0]?.activation.conditions).toEqual([
      { type: "cardInZone", owner: "opponent", zone: "shieldArea", comparison: "lte", count: 3 },
    ]);
  });

  it("deals 2 damage to an enemy Unit with 5 or less AP when the opponent has 3 or fewer Shields", () => {
    const enemy = createMockUnit({ ap: 5, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd02GundamVirsago037], resourceArea: activeResources(5) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer("player_one");
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd02GundamVirsago037, { targets: [enemyId] }));

    expect(getDamageCounter(engine, enemyId)).toBe(2);
  });

  it("does not fire the deploy damage while the opponent has 4 Shields", () => {
    const enemy = createMockUnit({ ap: 5, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd02GundamVirsago037], resourceArea: activeResources(5) },
      { play: [enemy], deck: 6 },
    );
    seedShieldsFromDeck(engine, PLAYER_TWO, 4);
    const p1 = engine.asPlayer("player_one");
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd02GundamVirsago037, { targets: [enemyId] }));

    expect(getDamageCounter(engine, enemyId)).toBe(0);
  });
});
