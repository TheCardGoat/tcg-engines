import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03CyclopsTeam126 } from "./126-cyclops-team.ts";

describe("Cyclops Team (GD03-126)", () => {
  it("【Burst】Deploy this card — flips into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03CyclopsTeam126] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd03CyclopsTeam126);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd03CyclopsTeam126], resourceArea: activeResources(4), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd03CyclopsTeam126));

    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getCardsInZone("baseSection").length).toBe(1);
  });

  it("gives friendly Unit tokens AP+1 during the opponent's turn only", () => {
    const token = createMockUnit({ ap: 2, hp: 1 });
    const nonToken = createMockUnit({ ap: 2, hp: 1 });
    const engine = GundamTestEngine.create(
      { play: [token, nonToken], baseSection: [gd03CyclopsTeam126] },
      {},
    );
    const [tokenId, nonTokenId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");
    engine.markAsToken(tokenId!);
    const framework = engine.getRuntime().getFrameworkReadAPI();

    let tokenStats = getEffectiveStats(tokenId!, engine.getG(), framework.cards, framework);
    let nonTokenStats = getEffectiveStats(nonTokenId!, engine.getG(), framework.cards, framework);
    expect(tokenStats.ap).toBe(2);
    expect(nonTokenStats.ap).toBe(2);

    engine.getState().ctx.status.activePlayer = asPlayerId(PLAYER_TWO);

    tokenStats = getEffectiveStats(tokenId!, engine.getG(), framework.cards, framework);
    nonTokenStats = getEffectiveStats(nonTokenId!, engine.getG(), framework.cards, framework);
    expect(tokenStats.ap).toBe(3);
    expect(nonTokenStats.ap).toBe(2);
  });
});
