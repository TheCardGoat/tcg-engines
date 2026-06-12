import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, createMockUnit } from "@tcg/gundam-engine";
import { gd04Alvatore080 } from "./080-alvatore.ts";

function findToken(engine: GundamTestEngine, tokenName: string): boolean {
  const framework = engine.getRuntime().getFrameworkReadAPI();
  return engine
    .asPlayer(PLAYER_ONE)
    .getCardsInZone("battleArea")
    .some((id) => {
      const def = framework.cards.getDefinition(id) as { name?: string } | undefined;
      return def?.name === tokenName;
    });
}

describe("Alvatore (GD04-080)", () => {
  it("【Destroyed】 deploys an Alvaaron token when another (UN)/(Superpower Bloc) Unit is in play", () => {
    const otherUn = createMockUnit({ ap: 1, hp: 3, traits: ["un"] });
    const engine = GundamTestEngine.create({
      play: [gd04Alvatore080, otherUn],
    });
    const [alvatoreId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");

    expect(findToken(engine, "Alvaaron")).toBe(false);

    engine.destroyUnit(alvatoreId!);

    expect(findToken(engine, "Alvaaron")).toBe(true);
  });

  it("【Destroyed】 does NOT deploy a token when no other (UN)/(Superpower Bloc) Unit is in play", () => {
    const engine = GundamTestEngine.create({
      play: [gd04Alvatore080],
    });
    const [alvatoreId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");

    engine.destroyUnit(alvatoreId!);

    expect(findToken(engine, "Alvaaron")).toBe(false);
  });
});
