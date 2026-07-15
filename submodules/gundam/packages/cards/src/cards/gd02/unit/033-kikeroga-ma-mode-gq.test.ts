import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  getEffectiveStats,
  markAsLinkUnit,
} from "@tcg/gundam-engine";
import { gd02KikerogaMaModeGq033 } from "./033-kikeroga-ma-mode-gq.ts";

describe("Kikeroga (MA Mode) (GQ) (GD02-033)", () => {
  it("gains <Breach 5> while another friendly (Zeon) Link Unit is in play", () => {
    const zeonLink = createMockUnit({ traits: ["zeon"] });
    const engine = GundamTestEngine.create({ play: [gd02KikerogaMaModeGq033, zeonLink] }, {});
    const [_kikerogaId, zeonLinkId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");
    markAsLinkUnit(engine, zeonLinkId!);

    const kikerogaId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(kikerogaId, engine.getG(), framework.cards, framework);
    expect(stats.keywords).toContain("Breach");
  });

  it("does NOT gain <Breach 5> without a friendly (Zeon) Link Unit", () => {
    const nonLinkZeon = createMockUnit({ traits: ["zeon"] });
    const engine = GundamTestEngine.create({ play: [gd02KikerogaMaModeGq033, nonLinkZeon] }, {});
    const kikerogaId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(kikerogaId, engine.getG(), framework.cards, framework);
    expect(stats.keywords ?? []).not.toContain("Breach");
  });
});
