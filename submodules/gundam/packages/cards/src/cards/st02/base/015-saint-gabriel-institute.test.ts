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
import { st02SaintGabrielInstitute015 } from "./015-saint-gabriel-institute.ts";

describe("Saint Gabriel Institute (ST02-015)", () => {
  it("【Deploy】 adds 1 shield to hand (and orders top 2 deck cards)", () => {
    const engine = GundamTestEngine.create(
      { hand: [st02SaintGabrielInstitute015], resourceArea: activeResources(2), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(st02SaintGabrielInstitute015));

    expect(p1.getHand()).toContain(shieldIds[0]);
    // Hand: -1 base + 1 shield = net zero. lookAtTopDeck "topAndBottom"
    // rearranges deck but does not draw.
    expect(p1.getHand().length).toBe(handBefore);
    expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE }).length).toBe(1);
  });

  it("【Burst】 Deploy this card — flips the base into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [st02SaintGabrielInstitute015] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, st02SaintGabrielInstitute015);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });
});
