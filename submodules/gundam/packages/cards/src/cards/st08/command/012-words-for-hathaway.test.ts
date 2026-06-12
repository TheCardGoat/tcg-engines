import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  hasKeywordGrant,
  markAsLinkUnit,
} from "@tcg/gundam-engine";
import { st08WordsForHathaway012 } from "./012-words-for-hathaway.ts";

describe("Words for Hathaway (ST08-012)", () => {
  describe("【Main】Choose 1 friendly Link Unit. It gains <Breach 1> during this turn.", () => {
    it("data targets one friendly Link Unit and grants Breach 1", () => {
      const effect = st08WordsForHathaway012.effects?.[0];
      const directive = effect?.directives[0];

      expect(effect?.type).toBe("command");
      expect(effect?.activation.timing).toEqual(["main"]);
      if (!directive || !("action" in directive) || directive.action.action !== "grantKeyword") {
        throw new Error("Unexpected directive shape");
      }
      expect(directive.action).toEqual({
        action: "grantKeyword",
        keyword: "Breach",
        keywordValue: 1,
        duration: "thisTurn",
        target: {
          owner: "friendly",
          cardType: "unit",
          isLinkUnit: true,
          count: 1,
        },
      });
      expect(st08WordsForHathaway012.pilotName).toBe("Gawman Nobile");
      expect(st08WordsForHathaway012.apBonus).toBe(1);
      expect(st08WordsForHathaway012.hpBonus).toBe(0);
    });

    it("grants Breach 1 to the chosen friendly Link Unit", () => {
      const linkUnit = createMockUnit({ ap: 3, hp: 5 });
      const otherUnit = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st08WordsForHathaway012],
        play: [linkUnit, otherUnit],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [linkId, otherId] = p1.getCardsInZone("battleArea");
      markAsLinkUnit(engine, linkId!);

      expectSuccess(p1.playCommand(st08WordsForHathaway012, { targets: [linkId!] }));

      expect(hasKeywordGrant(engine, linkId!, "Breach")).toBe(true);
      expect(hasKeywordGrant(engine, otherId!, "Breach")).toBe(false);
    });

    it("rejects a friendly Unit that is not a Link Unit", () => {
      const unit = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st08WordsForHathaway012],
        play: [unit],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(st08WordsForHathaway012, { targets: [unitId!] }),
        "INVALID_TARGET",
      );
    });

    it("cannot be played at action timing", () => {
      const linkUnit = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st08WordsForHathaway012],
        play: [linkUnit],
        resourceArea: activeResources(3),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [linkId] = p1.getCardsInZone("battleArea");
      markAsLinkUnit(engine, linkId!);

      expectFailure(
        p1.playCommand(st08WordsForHathaway012, { targets: [linkId!] }),
        "WRONG_TIMING",
      );
    });
  });
});
