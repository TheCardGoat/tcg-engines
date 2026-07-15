import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st08WordsForHathaway012 } from "./012-words-for-hathaway.ts";

describe("Words for Hathaway (ST08-012)", () => {
  describe("【Main】Choose 1 friendly Link Unit. It gains <Breach 1> during this turn.", () => {
    it("grants Breach 1 to the chosen friendly Link Unit", () => {
      const pilot = createMockPilot({ name: "Link Pilot", level: 1, cost: 1 });
      const linkUnit = createMockUnit({ ap: 3, hp: 5, linkCondition: "[Link Pilot]" });
      const otherUnit = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [pilot, st08WordsForHathaway012],
        play: [linkUnit, otherUnit],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [linkId, otherId] = p1.getCardsInZone("battleArea");
      expectSuccess(p1.assignPilot(pilot, linkId!));

      expectSuccess(p1.playCommand(st08WordsForHathaway012, { targets: [linkId!] }));

      expect(p1.getVisibleCard(linkId!)?.keywords).toContain("Breach");
      expect(p1.getVisibleCard(otherId!)?.keywords).not.toContain("Breach");
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
      const pilot = createMockPilot({ name: "Link Pilot", level: 1, cost: 1 });
      const linkUnit = createMockUnit({ ap: 3, hp: 5, linkCondition: "[Link Pilot]" });
      const defender = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot, st08WordsForHathaway012],
          play: [linkUnit],
          resourceArea: activeResources(3),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [linkId] = p1.getCardsInZone("battleArea");
      const [defenderId] = p2.getCardsInZone("battleArea");
      expectSuccess(p1.assignPilot(pilot, linkId!));
      expectSuccess(p1.enterBattle(linkId!, defenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());

      expectFailure(
        p1.playCommand(st08WordsForHathaway012, { targets: [linkId!] }),
        "WRONG_TIMING",
      );
    });
  });
});
