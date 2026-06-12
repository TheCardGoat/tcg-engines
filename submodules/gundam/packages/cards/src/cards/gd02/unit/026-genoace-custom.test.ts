import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  createMockResource,
  expectSuccess,
  findStatModifier,
} from "@tcg/gundam-engine";
import type { TestCardEntry } from "@tcg/gundam-engine";
import { gd02GenoaceCustom026 } from "./026-genoace-custom.ts";

function resources(n: number): TestCardEntry[] {
  return Array.from({ length: n }, () => ({ card: createMockResource(), exhausted: false }));
}

describe("Genoace Custom (GD02-026)", () => {
  it("【Deploy】 at Lv.7+ grants AP+2 to a chosen (AGE System) Unit", () => {
    const ageUnit = createMockUnit({ ap: 3, hp: 3, traits: ["earth federation", "age system"] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GenoaceCustom026],
        play: [ageUnit],
        resourceArea: resources(7),
        deck: 5,
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [ageUnitId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd02GenoaceCustom026, { targets: [ageUnitId!] }));

    expect(findStatModifier(engine, ageUnitId!, "ap")?.modifier).toBe(2);
  });

  it("【Deploy】 at Lv.6 does NOT grant AP+2 (playerLevel condition)", () => {
    const ageUnit = createMockUnit({ ap: 3, hp: 3, traits: ["earth federation", "age system"] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GenoaceCustom026],
        play: [ageUnit],
        resourceArea: resources(6),
        deck: 5,
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [ageUnitId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd02GenoaceCustom026));

    expect(findStatModifier(engine, ageUnitId!, "ap")).toBeUndefined();
  });
});
