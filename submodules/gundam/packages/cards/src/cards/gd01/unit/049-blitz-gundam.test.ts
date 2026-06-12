import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  activeResources,
  createMockUnit,
  hasKeywordGrant,
} from "@tcg/gundam-engine";
import { gd01BlitzGundam049 } from "./049-blitz-gundam.ts";

describe("Blitz Gundam (GD01-049)", () => {
  it("【Deploy】 grants <First Strike> to a friendly (ZAFT) Unit with 5+ AP", () => {
    const bigZaft = createMockUnit({
      ap: 5,
      hp: 3,
      traits: ["zaft"],
    });
    const engine = GundamTestEngine.create({
      hand: [gd01BlitzGundam049],
      resourceArea: activeResources(4),
      play: [bigZaft],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [zaftId] = p1.getCardsInZone("battleArea");

    expect(hasKeywordGrant(engine, zaftId!, "FirstStrike")).toBe(false);

    expectSuccess(p1.deployUnit(gd01BlitzGundam049, { targets: [zaftId!] }));

    expect(hasKeywordGrant(engine, zaftId!, "FirstStrike")).toBe(true);
  });
});
