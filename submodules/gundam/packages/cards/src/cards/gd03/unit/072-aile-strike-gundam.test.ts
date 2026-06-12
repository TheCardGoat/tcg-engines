import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd03AileStrikeGundam072 } from "./072-aile-strike-gundam.ts";

describe("Aile Strike Gundam (GD03-072)", () => {
  it("has Blocker", () => {
    const engine = GundamTestEngine.create({ play: [gd03AileStrikeGundam072] });
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    expect(getEffectiveStats(unitId, engine.getG(), framework.cards, framework).keywords).toContain(
      "Blocker",
    );
  });

  it("【Deploy】 with another Triple Ship Alliance Unit in play draws 1, then discards 1", () => {
    const ally = createMockUnit({ traits: ["triple ship alliance"] });
    const drawCard = createMockUnit();
    const engine = GundamTestEngine.create({
      hand: [gd03AileStrikeGundam072],
      play: [ally],
      resourceArea: activeResources(4),
      deck: [drawCard],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd03AileStrikeGundam072));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(0);
    expect(engine.getCardCount({ zone: "trash", playerId: PLAYER_ONE })).toBe(1);
    expect(p1.getCardsInZone("hand")).toHaveLength(0);
  });

  it("does not draw or discard without another Triple Ship Alliance Unit in play", () => {
    const drawCard = createMockUnit();
    const engine = GundamTestEngine.create({
      hand: [gd03AileStrikeGundam072],
      resourceArea: activeResources(4),
      deck: [drawCard],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd03AileStrikeGundam072));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(1);
    expect(engine.getCardCount({ zone: "trash", playerId: PLAYER_ONE })).toBe(0);
    expect(p1.getCardsInZone("hand")).toHaveLength(0);
  });
});
