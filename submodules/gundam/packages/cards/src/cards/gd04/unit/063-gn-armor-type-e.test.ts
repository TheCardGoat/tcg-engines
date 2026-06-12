import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GnArmorTypeE063 } from "./063-gn-armor-type-e.ts";

describe("GN Armor Type-E (GD04-063)", () => {
  it("【Deploy】 destroys a chosen enemy Unit with Lv.1 or lower (OR-clause)", () => {
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

    expect(engine.getState().ctx.zones.private.cardIndex[fragileId!]?.zoneKey).toBe(
      `trash:${PLAYER_TWO}`,
    );
    expect(engine.getState().ctx.zones.private.cardIndex[toughId!]?.zoneKey).toBe(
      `battleArea:${PLAYER_TWO}`,
    );
  });

  it("【Deploy】 destroys a chosen enemy Unit with AP 1 or lower (OR-clause)", () => {
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

    expect(engine.getState().ctx.zones.private.cardIndex[lowApId]?.zoneKey).toBe(
      `trash:${PLAYER_TWO}`,
    );
  });
});
