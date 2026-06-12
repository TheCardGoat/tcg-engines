import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { st06GquuuuuuxOmegaPsycommu001 } from "./001-gquuuuuux-omega-psycommu.ts";

describe("GQuuuuuuX (Omega Psycommu) (ST06-001)", () => {
  describe("【When Linked】If another friendly (Clan) Unit is in play, this gains <First Strike> during this turn.", () => {
    function keywords(engine: GundamTestEngine, cardId: string): string[] {
      const fw = engine.getRuntime().getFrameworkReadAPI();
      return getEffectiveStats(cardId, engine.getG(), fw.cards, fw).keywords;
    }

    it("data encodes another-friendly-Clan condition and self First Strike grant", () => {
      const effect = st06GquuuuuuxOmegaPsycommu001.effects?.[0];

      expect(effect?.type).toBe("triggered");
      expect(effect?.activation).toEqual({
        timing: ["whenLinked"],
        conditions: [
          {
            type: "unitCount",
            owner: "friendly",
            comparison: "gte",
            count: 1,
            hasTrait: "clan",
            excludeSelf: true,
          },
        ],
      });
      expect(effect?.directives).toEqual([
        {
          action: {
            action: "grantKeyword",
            keyword: "FirstStrike",
            duration: "thisTurn",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ]);
    });

    it("gains First Strike when linked while another friendly Clan Unit is in play", () => {
      const machu = createMockPilot({
        name: "Amate Yuzuriha (Machu)",
        level: 1,
        cost: 1,
      });
      const otherClan = createMockUnit({ traits: ["clan"], ap: 2, hp: 4 });
      const engine = GundamTestEngine.create({
        hand: [machu],
        play: [st06GquuuuuuxOmegaPsycommu001, otherClan],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [gquuuuuuxId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(machu, st06GquuuuuuxOmegaPsycommu001));

      expect(keywords(engine, gquuuuuuxId!)).toContain("FirstStrike");
    });

    it("does not gain First Strike when no other friendly Clan Unit is in play", () => {
      const machu = createMockPilot({
        name: "Amate Yuzuriha (Machu)",
        level: 1,
        cost: 1,
      });
      const engine = GundamTestEngine.create({
        hand: [machu],
        play: [st06GquuuuuuxOmegaPsycommu001],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [gquuuuuuxId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(machu, st06GquuuuuuxOmegaPsycommu001));

      expect(keywords(engine, gquuuuuuxId!)).not.toContain("FirstStrike");
    });
  });
});
