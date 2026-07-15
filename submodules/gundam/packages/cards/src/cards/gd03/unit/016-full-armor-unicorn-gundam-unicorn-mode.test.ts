import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd03FullArmorUnicornGundamUnicornMode016 } from "./016-full-armor-unicorn-gundam-unicorn-mode.ts";

describe("Full Armor Unicorn Gundam (Unicorn Mode) (GD03-016)", () => {
  it("deploys from hand and exposes its combat stats to the player", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03FullArmorUnicornGundamUnicornMode016],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd03FullArmorUnicornGundamUnicornMode016));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 5, effectiveHp: 4 });
    expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("cannot deploy without enough active Resources", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03FullArmorUnicornGundamUnicornMode016],
      resourceArea: [...activeResources(2), ...restedResources(3)],
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(gd03FullArmorUnicornGundamUnicornMode016),
      "INSUFFICIENT_RESOURCES",
    );
  });
});
