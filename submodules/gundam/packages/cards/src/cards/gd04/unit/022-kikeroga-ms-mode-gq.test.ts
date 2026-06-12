import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
  isCardExhausted,
} from "@tcg/gundam-engine";
import { gd04KikerogaMsModeGq022 } from "./022-kikeroga-ms-mode-gq.ts";

describe("Kikeroga (MS Mode) (GQ) (GD04-022)", () => {
  it("gives friendly Unit tokens <Breach 1>", () => {
    const token = createMockUnit({ level: 1, ap: 1, hp: 1 });
    const nonToken = createMockUnit({ level: 1, ap: 1, hp: 1 });
    const engine = GundamTestEngine.create({
      play: [gd04KikerogaMsModeGq022, token, nonToken],
    });
    const [, tokenId, nonTokenId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");
    engine.markAsToken(tokenId!);
    const framework = engine.getRuntime().getFrameworkReadAPI();

    expect(
      getEffectiveStats(tokenId!, engine.getG(), framework.cards, framework).keywords,
    ).toContain("Breach");
    expect(
      getEffectiveStats(nonTokenId!, engine.getG(), framework.cards, framework).keywords,
    ).not.toContain("Breach");
  });

  it("deploys Lv.3 or lower non-token Units rested while linked", () => {
    const challia = createMockPilot({ name: "Challia Bull", level: 1, cost: 1 });
    const lowLevel = createMockUnit({ level: 3, cost: 1, hp: 3 });
    const engine = GundamTestEngine.create({
      hand: [challia, lowLevel],
      play: [gd04KikerogaMsModeGq022],
      resourceArea: activeResources(7),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const kikerogaId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(challia, kikerogaId));
    expectSuccess(p1.deployUnit(lowLevel));
    const deployedId = p1.getCardsInZone("battleArea").find((id) => {
      const def = engine.getRuntime().getFrameworkReadAPI().cards.getDefinition(id);
      return id !== kikerogaId && def?.type === "unit";
    })!;

    expect(isCardExhausted(engine, deployedId)).toBe(true);
  });
});
