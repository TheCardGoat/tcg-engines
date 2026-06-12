import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  activeResources,
  createMockUnit,
  seedShieldsFromDeck,
  expectFailure,
  expectSuccess,
  hasContinuousRestriction,
} from "@tcg/gundam-engine";
import { gd01GuelJeturk097 } from "./097-guel-jeturk.ts";

describe("Guel Jeturk (GD01-097)", () => {
  it("【Burst】 Add this card to your hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd01GuelJeturk097] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd01GuelJeturk097.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);

    const zone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(zone).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【Activate･Main】 rejected when opponent has fewer than 8 cards in hand (conditions gate)", () => {
    const hostUnit = createMockUnit({ ap: 3, hp: 3, level: 3 });
    const engine = GundamTestEngine.create(
      {
        play: [hostUnit],
        hand: [gd01GuelJeturk097],
        resourceArea: activeResources(3),
        deck: 5,
      },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    p1.assignPilot(gd01GuelJeturk097, hostUnit);

    // After pairing, find the pilot's card ID.
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const pilotId = p1.getCardsInZone("battleArea").find((id) => id !== hostId)!;

    // Opponent has 0 cards in hand — condition "opponent has 8+ cards" fails.
    const result = p1.activateAbility(pilotId, 0);

    expectFailure(result);
  });

  it("【Activate･Main】 sets unit active and applies cantAttack when opponent has 8+ cards", () => {
    const hostUnit = createMockUnit({ ap: 3, hp: 3, level: 3 });
    const opponentHand = Array.from({ length: 8 }, () => createMockUnit());
    const engine = GundamTestEngine.create(
      {
        play: [{ card: hostUnit, exhausted: true }],
        hand: [gd01GuelJeturk097],
        resourceArea: activeResources(3),
        deck: 5,
      },
      { hand: opponentHand, deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    p1.assignPilot(gd01GuelJeturk097, hostUnit);

    // After pairing the pilot is in battleArea.
    const pilotId = p1.getCardsInZone("battleArea").find((id) => id !== hostId)!;

    // Opponent has 8 cards in hand — condition satisfied.
    const result = p1.activateAbility(pilotId, 0);
    expectSuccess(result);

    // Unit should be set active (no longer exhausted).
    expect(engine.getG().exhausted[hostId]).toBeFalsy();
    // Unit should have cannot-attack restriction.
    expect(hasContinuousRestriction(engine, hostId, "cannot-attack")).toBe(true);
  });
});
