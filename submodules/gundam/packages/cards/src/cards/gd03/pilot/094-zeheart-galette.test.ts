import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03ZeheartGalette094 } from "./094-zeheart-galette.ts";

describe("Zeheart Galette (GD03-094)", () => {
  it("【Burst】 adds this card to hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03ZeheartGalette094] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  describe("【When Paired】Place the top 2 cards of your deck into your trash. If you placed a (Vagan) card with this effect, choose 1 enemy Unit. It gets AP-2 during this turn.", () => {
    it("mills 2 and gives an enemy Unit AP-2 when one milled card is Vagan", () => {
      const host = createMockUnit({ name: "Zeheart Host", ap: 2, hp: 4 });
      const vaganCard = createMockUnit({ name: "Vagan Mill", traits: ["vagan"] });
      const filler = createMockUnit({ name: "Filler", traits: ["zeon"] });
      const enemy = createMockUnit({ ap: 4, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03ZeheartGalette094],
          play: [host],
          deck: [filler, vaganCard],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd03ZeheartGalette094, hostId));

      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(p1.getCardsInZone("trash")).toHaveLength(2);
      expect(getEffectiveStats(enemyId, engine.getG(), framework.cards, framework).ap).toBe(2);
    });

    it("mills 2 without applying AP-2 when no milled card is Vagan", () => {
      const host = createMockUnit({ name: "Zeheart Host", ap: 2, hp: 4 });
      const filler1 = createMockUnit({ name: "Filler 1", traits: ["zeon"] });
      const filler2 = createMockUnit({ name: "Filler 2", traits: ["clan"] });
      const enemy = createMockUnit({ ap: 4, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03ZeheartGalette094],
          play: [host],
          deck: [filler1, filler2],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd03ZeheartGalette094, hostId));

      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(p1.getCardsInZone("trash")).toHaveLength(2);
      expect(getEffectiveStats(enemyId, engine.getG(), framework.cards, framework).ap).toBe(4);
    });
  });
});
