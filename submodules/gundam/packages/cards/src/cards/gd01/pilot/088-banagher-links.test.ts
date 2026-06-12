import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd01BanagherLinks088 } from "./088-banagher-links.ts";

describe("Banagher Links (GD01-088)", () => {
  it("【Burst】Add this card to your hand.", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd01BanagherLinks088] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd01BanagherLinks088.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);

    const zone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(zone).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【When Linked】Draw 1.", () => {
    // Wave-14 PR #142 routes pilot-resident triggered effects through the
    // paired-unit event pipeline. A Unit whose linkCondition names Banagher
    // becomes a Link Unit on pairing, which fires the pilot's `whenLinked`
    // directive.
    const linkUnit = createMockUnit({
      ap: 2,
      hp: 4,
      level: 3,
      cost: 2,
      linkCondition: "[Banagher Links]",
      // biome-ignore lint/suspicious/noExplicitAny: linkCondition is outside createMockUnit's public type
    } as any);

    const engine = GundamTestEngine.create(
      {
        hand: [gd01BanagherLinks088],
        play: [linkUnit],
        resourceArea: activeResources(5),
        deck: 5,
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [linkUnitId] = p1.getCardsInZone("battleArea");
    const before = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    expectSuccess(p1.assignPilot(gd01BanagherLinks088, linkUnitId!));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(before - 1);
  });
});
