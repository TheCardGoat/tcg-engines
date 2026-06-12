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
import { gd02Freeden127 } from "./127-freeden.ts";

describe("Freeden (GD02-127)", () => {
  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd02Freeden127], resourceArea: activeResources(6), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(gd02Freeden127));

    // Top shield enters hand; hand count unchanged (base out, shield in).
    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getHand().length).toBe(handBefore);
    expect(engine.getCardsInZone({ zone: "shieldArea", playerId: PLAYER_ONE })).toEqual([
      shieldIds[1],
    ]);
    expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE }).length).toBe(1);
  });

  it("【Burst】 Deploy this card — flips Freeden into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02Freeden127] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd02Freeden127);

    engine.fireShieldBurst(shieldId);

    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Destroyed】 mills top 2 of your deck into your trash", () => {
    // Deploy Freeden through deployBase (mirrors the 【Deploy】 test above)
    // so the base lands cleanly in baseSection with full card-instance wiring.
    // deck must be large enough to cover shield seeding + 2 mills + the
    // shield the Deploy trigger pulls into hand.
    const engine = GundamTestEngine.create(
      { hand: [gd02Freeden127], resourceArea: activeResources(6), deck: 8 },
      {},
    );
    seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.deployBase(gd02Freeden127));

    const [freedenId] = engine.getCardsInZone({
      zone: "baseSection",
      playerId: PLAYER_ONE,
    });
    if (!freedenId) throw new Error("fixture failed — Freeden not in baseSection");

    const deckBefore = engine.getCardsInZone({ zone: "deck", playerId: PLAYER_ONE }).length;
    const trashBefore = engine.getCardsInZone({ zone: "trash", playerId: PLAYER_ONE }).length;

    engine.destroyUnit(freedenId);

    const deckAfter = engine.getCardsInZone({ zone: "deck", playerId: PLAYER_ONE }).length;
    const trashAfter = engine.getCardsInZone({ zone: "trash", playerId: PLAYER_ONE }).length;

    // 2 cards left deck (milled), Freeden + 2 milled cards arrived in trash.
    expect(deckAfter).toBe(deckBefore - 2);
    expect(trashAfter).toBe(trashBefore + 3);
  });
});
