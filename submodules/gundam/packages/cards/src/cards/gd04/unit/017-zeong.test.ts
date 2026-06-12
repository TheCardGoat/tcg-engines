import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Zeong017 } from "./017-zeong.ts";

function countTokensInBattleArea(engine: GundamTestEngine, tokenName: string): number {
  const framework = engine.getRuntime().getFrameworkReadAPI();
  return engine
    .asPlayer(PLAYER_ONE)
    .getCardsInZone("battleArea")
    .filter((id) => {
      const def = framework.cards.getDefinition(id) as { name?: string } | undefined;
      return def?.name === tokenName;
    }).length;
}

describe("Zeong (GD04-017)", () => {
  it("【When Paired･(Newtype) Pilot】 deploys 2 Wire-Guided Arm tokens", () => {
    const charNewtype = createMockPilot({
      name: "Char Aznable",
      traits: ["newtype"],
      level: 6,
      cost: 1,
    });
    const engine = GundamTestEngine.create({
      hand: [charNewtype],
      play: [gd04Zeong017],
      resourceArea: activeResources(7),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.assignPilot(charNewtype, gd04Zeong017));

    expect(countTokensInBattleArea(engine, "Wire-Guided Arm")).toBe(2);
  });

  it("【When Paired】 does NOT deploy tokens when the paired Pilot lacks the (Newtype) trait", () => {
    const plainPilot = createMockPilot({
      name: "Char Aznable",
      traits: [],
      level: 6,
      cost: 1,
    });
    const engine = GundamTestEngine.create({
      hand: [plainPilot],
      play: [gd04Zeong017],
      resourceArea: activeResources(7),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.assignPilot(plainPilot, gd04Zeong017));

    expect(countTokensInBattleArea(engine, "Wire-Guided Arm")).toBe(0);
  });
});
