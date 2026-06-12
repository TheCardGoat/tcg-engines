/**
 * Orga, Crot, and Shani (GD02-087)
 *
 * 【Burst】Add this card to your hand.
 * 【When Linked】If this is a blue Unit, choose 1 enemy Unit with <Blocker>. Rest it.
 *
 * Exercises the `linkedUnitHasColor` condition and targeted rest on
 * an enemy Blocker unit.
 */

import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd02OrgaCrotAndShani087 } from "./087-orga-crot-and-shani.ts";

describe("Orga, Crot, and Shani (GD02-087)", () => {
  it("【Burst】Add this card to your hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02OrgaCrotAndShani087] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【When Linked】on blue Unit → rest enemy Blocker", () => {
    const blueUnit = createMockUnit({
      level: 4,
      cost: 1,
      color: "blue",
      linkCondition: "[Orga, Crot, and Shani]",
    });
    const blockerUnit = createMockUnit({
      level: 3,
      cost: 1,
      color: "red",
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create(
      {
        hand: [blueUnit, gd02OrgaCrotAndShani087],
        resourceArea: activeResources(6),
      },
      {
        play: [blockerUnit],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [blockerId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(blueUnit));
    expectSuccess(p1.assignPilot(gd02OrgaCrotAndShani087, blueUnit));

    // The enemy Blocker should now be rested.
    expect(engine.getG().exhausted[blockerId!]).toBe(true);
  });

  it("【When Linked】on non-blue Unit → does nothing", () => {
    const redUnit = createMockUnit({
      level: 4,
      cost: 1,
      color: "red",
      linkCondition: "[Orga, Crot, and Shani]",
    });
    const blockerUnit = createMockUnit({
      level: 3,
      cost: 1,
      color: "red",
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create(
      {
        hand: [redUnit, gd02OrgaCrotAndShani087],
        resourceArea: activeResources(6),
      },
      {
        play: [blockerUnit],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [blockerId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(redUnit));
    expectSuccess(p1.assignPilot(gd02OrgaCrotAndShani087, redUnit));

    // Condition gate blocked — enemy Blocker should remain active.
    expect(engine.getG().exhausted[blockerId!] ?? false).toBe(false);
  });
});
