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
import { gd03WistarioAfam097 } from "./097-wistario-afam.ts";

describe("Wistario Afam (GD03-097)", () => {
  it("【Burst】 adds this card to hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03WistarioAfam097] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  describe("【During Link】【Once per Turn】During your turn, when this Unit destroys an enemy Unit with battle damage, look at the top 2 cards of your deck and return 1 to the top. Place the remaining card into your trash.", () => {
    it("keeps one of the top 2 cards in deck and places the remaining card into trash", () => {
      const host = createMockUnit({
        name: "Wistario Host",
        ap: 4,
        hp: 5,
        level: 4,
        cost: 2,
        linkCondition: "[Wistario Afam]",
      } as unknown as Parameters<typeof createMockUnit>[0]);
      const fragileEnemy = createMockUnit({ ap: 1, hp: 1 });
      const kept = createMockUnit({ name: "Kept Top" });
      const trashed = createMockUnit({ name: "Trashed Remaining" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03WistarioAfam097],
          play: [host],
          deck: [kept, trashed],
          resourceArea: activeResources(5),
        },
        { play: [{ card: fragileEnemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd03WistarioAfam097, hostId));

      engine.resolveCombat({ attackerId: hostId, target: defenderId });

      expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(1);
      expect(p1.getCardsInZone("trash")).toHaveLength(1);
      const framework = engine.getRuntime().getFrameworkReadAPI();
      const trashContainsRemaining = p1
        .getCardsInZone("trash")
        .some((id) => framework.cards.getDefinition(id)?.name === "Trashed Remaining");
      expect(trashContainsRemaining).toBe(true);
    });

    it("does not look at the deck when the paired Unit is not linked", () => {
      const host = createMockUnit({
        name: "Wrong Host",
        ap: 4,
        hp: 5,
        level: 4,
        cost: 2,
        linkCondition: "[Different Pilot]",
      } as unknown as Parameters<typeof createMockUnit>[0]);
      const fragileEnemy = createMockUnit({ ap: 1, hp: 1 });
      const top1 = createMockUnit({ name: "Top 1" });
      const top2 = createMockUnit({ name: "Top 2" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03WistarioAfam097],
          play: [host],
          deck: [top1, top2],
          resourceArea: activeResources(5),
        },
        { play: [{ card: fragileEnemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd03WistarioAfam097, hostId));

      engine.resolveCombat({ attackerId: hostId, target: defenderId });

      expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(2);
      expect(p1.getCardsInZone("trash")).toHaveLength(0);
    });
  });
});
