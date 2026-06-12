import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04ReineforceJr121 } from "./121-reineforce-jr.ts";

describe("Reineforce Jr. (GD04-121)", () => {
  it("【Deploy】 adds 1 shield to hand", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04ReineforceJr121],
      resourceArea: activeResources(3),
      deck: 4,
    });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd04ReineforceJr121));

    expect(p1.getHand()).toContain(shieldId);
    expect(p1.getCardsInZone("baseSection")).toHaveLength(1);
  });

  it("【Burst】 deploys this card from shield area", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd04ReineforceJr121] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd04ReineforceJr121);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("deploys a Parts token when a friendly League Militaire Unit is in play on your turn", () => {
    const leagueUnit = createMockUnit({ traits: ["league militaire"] });
    const engine = GundamTestEngine.create({
      hand: [gd04ReineforceJr121],
      play: [leagueUnit],
      resourceArea: activeResources(3),
      deck: 4,
    });
    seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd04ReineforceJr121));

    const tokenId = p1.getCardsInZone("battleArea").at(-1)!;
    const token = engine.getRuntime().getFrameworkReadAPI().cards.getDefinition(tokenId);
    expect(token?.name).toBe("Parts");
  });
});
