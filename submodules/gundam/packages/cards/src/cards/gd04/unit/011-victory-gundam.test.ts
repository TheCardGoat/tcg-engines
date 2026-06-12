import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, createMockUnit } from "@tcg/gundam-engine";
import { gd04VictoryGundam011 } from "./011-victory-gundam.ts";

function partsTokenCount(engine: GundamTestEngine): number {
  const framework = engine.getRuntime().getFrameworkReadAPI();
  return engine
    .asPlayer(PLAYER_ONE)
    .getCardsInZone("battleArea")
    .filter((id) => {
      const def = framework.cards.getDefinition(id) as { name?: string } | undefined;
      return def?.name === "Parts";
    }).length;
}

describe("Victory Gundam (GD04-011)", () => {
  it("【Destroyed】 deploys 1 Parts token when another (League Militaire) Unit is in play", () => {
    const otherLm = createMockUnit({ ap: 1, hp: 3, traits: ["league militaire"] });

    const engine = GundamTestEngine.create({
      play: [gd04VictoryGundam011, otherLm],
    });
    const [vgId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");

    expect(partsTokenCount(engine)).toBe(0);

    engine.destroyUnit(vgId!);

    expect(partsTokenCount(engine)).toBe(1);
  });

  it("【Destroyed】 does NOT deploy a Parts token when no other (League Militaire) Unit is in play", () => {
    const engine = GundamTestEngine.create({
      play: [gd04VictoryGundam011],
    });
    const [vgId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");

    engine.destroyUnit(vgId!);

    expect(partsTokenCount(engine)).toBe(0);
  });
});
