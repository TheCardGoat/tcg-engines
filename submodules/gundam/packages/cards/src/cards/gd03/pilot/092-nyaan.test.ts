import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03Nyaan092 } from "./092-nyaan.ts";

describe("Nyaan (GD03-092)", () => {
  it("【Burst】 adds this card to hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03Nyaan092] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  describe("【When Linked】Place the top card of your deck into your trash. If you placed a (Zeon)/(Clan) card with this effect, choose 1 enemy Unit. Deal 1 damage to it.", () => {
    it("mills the top Zeon card and deals 1 damage to a chosen enemy Unit", () => {
      const host = createMockUnit({
        name: "Nyaan Host",
        ap: 2,
        hp: 4,
        level: 4,
        cost: 2,
        linkCondition: "[Nyaan]",
      } as unknown as Parameters<typeof createMockUnit>[0]);
      const zeonCard = createMockUnit({ name: "Zeon Mill", traits: ["zeon"] });
      const enemy = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03Nyaan092],
          play: [host],
          deck: [zeonCard],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd03Nyaan092, hostId));

      expect(p1.getCardsInZone("trash")).toHaveLength(1);
      expect(getDamageCounter(engine, enemyId)).toBe(1);
    });

    it("mills the top Clan card and deals 1 damage to a chosen enemy Unit", () => {
      const host = createMockUnit({
        name: "Nyaan Host",
        ap: 2,
        hp: 4,
        level: 4,
        cost: 2,
        linkCondition: "[Nyaan]",
      } as unknown as Parameters<typeof createMockUnit>[0]);
      const clanCard = createMockUnit({ name: "Clan Mill", traits: ["clan"] });
      const enemy = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03Nyaan092],
          play: [host],
          deck: [clanCard],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd03Nyaan092, hostId));

      expect(p1.getCardsInZone("trash")).toHaveLength(1);
      expect(getDamageCounter(engine, enemyId)).toBe(1);
    });

    it("mills without dealing damage when the top card is not Zeon or Clan", () => {
      const host = createMockUnit({
        name: "Nyaan Host",
        ap: 2,
        hp: 4,
        level: 4,
        cost: 2,
        linkCondition: "[Nyaan]",
      } as unknown as Parameters<typeof createMockUnit>[0]);
      const nonMatch = createMockUnit({ name: "Non-match", traits: ["vagan"] });
      const enemy = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03Nyaan092],
          play: [host],
          deck: [nonMatch],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd03Nyaan092, hostId));

      expect(p1.getCardsInZone("trash")).toHaveLength(1);
      expect(getDamageCounter(engine, enemyId)).toBe(0);
    });
  });
});
