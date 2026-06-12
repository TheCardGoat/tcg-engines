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
import { gd04GundamNadleeh057 } from "./057-gundam-nadleeh.ts";

describe("Gundam Nadleeh (GD04-057)", () => {
  it("can be placed in the battle area with its printed stats", () => {
    const engine = GundamTestEngine.create({ play: [gd04GundamNadleeh057] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(gd04GundamNadleeh057.type).toBe("unit");
    expect(gd04GundamNadleeh057.level).toBe(4);
    expect(gd04GundamNadleeh057.cost).toBe(3);
    expect(gd04GundamNadleeh057.ap).toBe(4);
    expect(gd04GundamNadleeh057.hp).toBe(3);
  });

  it("reduces a Lv.6 or lower enemy Unit's AP by your trash Gundam Virtue Unit count on deploy", () => {
    const virtue = createMockUnit({ name: "Gundam Virtue" });
    const virtueTransAm = createMockUnit({ name: "Gundam Virtue (Trans-Am)" });
    const nonVirtue = createMockUnit({ name: "Gundam Kyrios" });
    const enemy = createMockUnit({ name: "Enemy Target", level: 6, ap: 5, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04GundamNadleeh057],
        trash: [virtue, virtueTransAm, nonVirtue],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd04GundamNadleeh057, { targets: [enemyId] }));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    expect(getEffectiveStats(enemyId, engine.getG(), framework.cards, framework).ap).toBe(3);
  });
});
