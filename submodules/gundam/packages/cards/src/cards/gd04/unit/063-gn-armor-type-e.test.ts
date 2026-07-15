import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GnArmorTypeE063 } from "./063-gn-armor-type-e.ts";

describe("GN Armor Type-E (GD04-063)", () => {
  describe("【Deploy】Choose 1 enemy Unit that is Lv.1 or lower or has 1 or less AP. Destroy it.", () => {
    it("destroys a chosen Lv.1 enemy Unit and leaves the other Unit in play", () => {
      const fragile = createMockUnit({ ap: 4, hp: 5, level: 1 });
      const tough = createMockUnit({ ap: 4, hp: 5, level: 5 });

      const engine = GundamTestEngine.create(
        {
          hand: [gd04GnArmorTypeE063],
          resourceArea: activeResources(4),
        },
        { play: [fragile, tough] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [fragileId, toughId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(gd04GnArmorTypeE063, { targets: [fragileId!] }));

      expect(p2.getCardZone(fragileId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardZone(toughId!)).toBe(`battleArea:${PLAYER_TWO}`);
    });

    it("destroys a chosen AP 1 enemy Unit even when its Lv. is higher than 1", () => {
      const lowAp = createMockUnit({ ap: 1, hp: 8, level: 6 });

      const engine = GundamTestEngine.create(
        {
          hand: [gd04GnArmorTypeE063],
          resourceArea: activeResources(4),
        },
        { play: [lowAp] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const lowApId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd04GnArmorTypeE063, { targets: [lowApId] }));

      expect(p2.getCardZone(lowApId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("rejects an enemy Unit that is above both limits", () => {
      const ineligible = createMockUnit({ ap: 2, hp: 8, level: 2 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04GnArmorTypeE063],
          resourceArea: activeResources(4),
        },
        { play: [ineligible] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const ineligibleId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.deployUnit(gd04GnArmorTypeE063, { targets: [ineligibleId] }),
        "INVALID_TARGET",
      );

      expect(p1.getCardZone(gd04GnArmorTypeE063)).toBe(`hand:${PLAYER_ONE}`);
      expect(p2.getCardZone(ineligibleId)).toBe(`battleArea:${PLAYER_TWO}`);
    });
  });
});
