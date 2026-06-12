import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  activeResources,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st03Falmel016 } from "./016-falmel.ts";

describe("Falmel (ST03-016)", () => {
  it("【Deploy】 adds 1 shield to hand and deploys a rested Char's Zaku II token", () => {
    const engine = GundamTestEngine.create(
      { hand: [st03Falmel016], resourceArea: activeResources(3), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const playBefore = p1.getCardsInZone("battleArea").length;

    expectSuccess(p1.deployBase(st03Falmel016));

    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getCardsInZone("battleArea").length).toBe(playBefore + 1);
  });

  it("【Burst】 Deploy this card — flips into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [st03Falmel016] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, st03Falmel016);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });
});
