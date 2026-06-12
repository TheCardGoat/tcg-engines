import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
  markAsLinkUnit,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd02LalahSune089 } from "./089-lalah-sune.ts";

describe("Lalah Sune (GD02-089)", () => {
  it("【Burst】Add this card to your hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02LalahSune089] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【When Paired】grants <Breach 1> to a friendly (Zeon) Link Unit", () => {
    // The printed "other" qualifier is not encoded in card data — any
    // friendly (Zeon) Link Unit is eligible.
    const zeonLink = createMockUnit({
      name: "Zeon Link",
      ap: 2,
      hp: 4,
      level: 3,
      cost: 2,
      traits: ["zeon"],
    });
    const pairedUnit = createMockUnit({
      ap: 2,
      hp: 4,
      level: 3,
      cost: 2,
      traits: ["zeon"],
    });

    const engine = GundamTestEngine.create(
      {
        hand: [gd02LalahSune089],
        play: [zeonLink, pairedUnit],
        resourceArea: activeResources(6),
        deck: 5,
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [zeonLinkId, pairedId] = p1.getCardsInZone("battleArea");
    markAsLinkUnit(engine, zeonLinkId!);

    expectSuccess(p1.assignPilot(gd02LalahSune089, pairedId!));

    if (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ targets: [zeonLinkId!] }));
    }

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(zeonLinkId!, engine.getG(), framework.cards, framework);
    expect(stats.keywords).toContain("Breach");
  });
});
