import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01MasterLeagueBegins077 } from "./077-master-league-begins.ts";

describe("Master League Begins (EB01-077)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("moves the revealed Shield to its owner's hand when Burst is accepted", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { shieldArea: [eb01MasterLeagueBegins077], deck: 5 },
        { play: [attacker], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      const burst = p1.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p1.getCardZone(eb01MasterLeagueBegins077)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【Action】Choose 1 rested friendly (G Generation) Unit. Change a battling enemy Unit's attack target to it.", () => {
    it("redirects a battling enemy to a rested friendly G Generation Unit", () => {
      const redirect = createMockUnit({ traits: ["g generation"], hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [eb01MasterLeagueBegins077],
          play: [{ card: redirect, exhausted: true }],
          resourceArea: activeResources(3),
        },
        { play: [createMockUnit({ ap: 3 })] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const redirectId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.playCommand(eb01MasterLeagueBegins077));
      expectSuccess(p1.resolveEffect({ targets: [redirectId] }));

      expect(p1.getBoardView().pendingCombat?.target).toBe(redirectId);
    });

    it("rejects a rested friendly Unit without the G Generation trait", () => {
      const notGGeneration = createMockUnit({ traits: ["other"] });
      const engine = GundamTestEngine.create(
        {
          hand: [eb01MasterLeagueBegins077],
          play: [{ card: notGGeneration, exhausted: true }],
          resourceArea: activeResources(3),
        },
        { play: [createMockUnit({ ap: 3 })] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const notGGenerationId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p1.passBlock());
      expectFailure(
        p1.playCommand(eb01MasterLeagueBegins077, { targets: [notGGenerationId] }),
        "INVALID_TARGET",
      );
      expect(p1.getCardZone(eb01MasterLeagueBegins077)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
