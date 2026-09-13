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
import { gd05ExclusivelyDefenseOrientedPolicy105 } from "./105-exclusively-defense-oriented-policy.ts";

describe("Exclusively Defense-Oriented Policy (GD05-105)", () => {
  describe("【Burst】Activate this card's 【Main】.", () => {
    it("replays Main for free when Burst is accepted", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const eligible = createMockUnit({ level: 3 });
      const engine = GundamTestEngine.create(
        { shieldArea: [gd05ExclusivelyDefenseOrientedPolicy105] },
        { play: [attacker, eligible] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [attackerId, eligibleId] = p2.getCardsInZone("battleArea");

      expectSuccess(p2.enterBattle(attackerId!, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      const burst = p1.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      const shieldId = burst.sourceCardId;
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

      expect(p2.getCardZone(eligibleId!)).toBe(`hand:${PLAYER_TWO}`);
      expect(p1.getCardZone(shieldId)).toBe(`trash:${PLAYER_ONE}`);
    });
  });

  describe("【Main】/【Action】Choose 1 enemy Unit that is Lv.3 or lower. Return it to its owner's hand.", () => {
    it("returns a chosen enemy Unit at Lv.3 or lower during Main", () => {
      const engine = GundamTestEngine.create(
        { hand: [gd05ExclusivelyDefenseOrientedPolicy105], resourceArea: activeResources(3) },
        { play: [createMockUnit({ level: 3 }), createMockUnit({ level: 4 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [eligible, ineligible] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd05ExclusivelyDefenseOrientedPolicy105));
      expectSuccess(p1.resolveEffect({ targets: [eligible!] }));

      expect(p2.getCardZone(eligible!)).toBe(`hand:${PLAYER_TWO}`);
      expect(p2.getCardZone(ineligible!)).toBe(`battleArea:${PLAYER_TWO}`);
    });

    it("returns an eligible enemy Unit during a legally reached Action step", () => {
      const eligible = createMockUnit({ level: 3 });
      const engine = GundamTestEngine.create(
        { hand: [gd05ExclusivelyDefenseOrientedPolicy105], resourceArea: activeResources(3) },
        { play: [eligible] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const eligibleId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(gd05ExclusivelyDefenseOrientedPolicy105));
      expectSuccess(p1.resolveEffect({ targets: [eligibleId] }));

      expect(p2.getCardZone(eligibleId)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("rejects an enemy Unit above Lv.3", () => {
      const tooHigh = createMockUnit({ level: 4 });
      const engine = GundamTestEngine.create(
        { hand: [gd05ExclusivelyDefenseOrientedPolicy105], resourceArea: activeResources(3) },
        { play: [tooHigh] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const tooHighId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(gd05ExclusivelyDefenseOrientedPolicy105, { targets: [tooHighId] }),
        "INVALID_TARGET",
      );
      expect(p1.getCardZone(gd05ExclusivelyDefenseOrientedPolicy105)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
