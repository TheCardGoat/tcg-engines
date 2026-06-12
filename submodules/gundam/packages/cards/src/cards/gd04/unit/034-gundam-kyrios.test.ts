import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  getEffectiveStats,
  markAsLinkUnit,
} from "@tcg/gundam-engine";
import { gd04GundamKyrios034 } from "./034-gundam-kyrios.ts";

describe("Gundam Kyrios (GD04-034)", () => {
  it("has its printed keyword effects", () => {
    expect(gd04GundamKyrios034.keywordEffects.map((effect) => effect.keyword)).toEqual([
      "FirstStrike",
    ]);
  });

  describe("【During Link】This Unit gets AP+2 for each of your rested (CB) Units.", () => {
    it("gets AP+2 for each rested friendly CB Unit while linked", () => {
      const restedCb = createMockUnit({ name: "Rested CB", traits: ["cb"], ap: 2, hp: 3 });
      const activeCb = createMockUnit({ name: "Active CB", traits: ["cb"], ap: 2, hp: 3 });
      const restedNonCb = createMockUnit({ name: "Rested Other", traits: ["zaft"], ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        play: [gd04GundamKyrios034, restedCb, activeCb, restedNonCb],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [kyriosId, restedCbId, , restedNonCbId] = p1.getCardsInZone("battleArea");
      engine.getG().exhausted[kyriosId!] = true;
      engine.getG().exhausted[restedCbId!] = true;
      engine.getG().exhausted[restedNonCbId!] = true;
      markAsLinkUnit(engine, kyriosId!);

      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(getEffectiveStats(kyriosId!, engine.getG(), framework.cards, framework).ap).toBe(5);
    });

    it("does not get the rested-CB AP bonus while unlinked", () => {
      const restedCb = createMockUnit({ name: "Rested CB", traits: ["cb"], ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        play: [gd04GundamKyrios034, restedCb],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [kyriosId, restedCbId] = p1.getCardsInZone("battleArea");
      engine.getG().exhausted[kyriosId!] = true;
      engine.getG().exhausted[restedCbId!] = true;

      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(getEffectiveStats(kyriosId!, engine.getG(), framework.cards, framework).ap).toBe(1);
    });
  });
});
