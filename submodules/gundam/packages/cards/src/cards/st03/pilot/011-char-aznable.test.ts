import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st03CharAznable011 } from "./011-char-aznable.ts";

describe("Char Aznable (ST03-011)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds Char Aznable to hand when its controller accepts the revealed Shield prompt", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st03CharAznable011] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Char Aznable's Burst choice");
      const shieldId = burst.sourceCardId;
      expect(burst.directiveIndex).toBe(-1);
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

      expect(p2.getCardZone(shieldId)).toBe(`hand:${PLAYER_TWO}`);
      expect(p2.getBoardView().pendingChoice).toBeUndefined();
    });

    it("puts Char Aznable into trash when its controller declines Burst", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st03CharAznable011] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Char Aznable's Burst choice");
      const shieldId = burst.sourceCardId;
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getCardZone(shieldId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getBoardView().pendingChoice).toBeUndefined();
    });
  });

  describe("【Attack】During this turn, this Unit gets AP+1 and, if it is a Link Unit, it gains <High-Maneuver>.", () => {
    it("gives the paired Unit AP+1 when it attacks whether or not it is linked", () => {
      const host = createMockUnit({ name: "Non-Link Host", ap: 2, hp: 5 });
      const enemy = createMockUnit({ name: "Enemy", ap: 0, hp: 8 });
      const engine = GundamTestEngine.create(
        { hand: [st03CharAznable011], play: [host], resourceArea: activeResources(3) },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st03CharAznable011, hostId));
      expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(3);
      expectSuccess(p1.enterBattle(hostId, enemyId));

      expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(4);
      expect(p1.getVisibleCard(hostId)?.keywords).not.toContain("HighManeuver");
    });

    it("grants High-Maneuver when Char satisfies the host's Link Condition", () => {
      const host = createMockUnit({
        name: "Link Host",
        ap: 2,
        hp: 5,
        linkCondition: "[Char Aznable]",
      });
      const enemy = createMockUnit({ name: "Enemy", ap: 0, hp: 8 });
      const engine = GundamTestEngine.create(
        { hand: [st03CharAznable011], play: [host], resourceArea: activeResources(3) },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st03CharAznable011, hostId));
      expectSuccess(p1.enterBattle(hostId, enemyId));

      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 4 });
      expect(p1.getVisibleCard(hostId)?.keywords).toContain("HighManeuver");
    });

    it("prevents an enemy Blocker from intercepting the linked Unit's attack", () => {
      const host = createMockUnit({
        name: "Link Host",
        ap: 2,
        hp: 5,
        linkCondition: "[Char Aznable]",
      });
      const blocker = createMockUnit({
        name: "Enemy Blocker",
        keywordEffects: [{ keyword: "Blocker" }],
      });
      const engine = GundamTestEngine.create(
        { hand: [st03CharAznable011], play: [host], resourceArea: activeResources(3) },
        { play: [blocker] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st03CharAznable011, hostId));
      expectSuccess(p1.enterBattle(hostId, "direct"));

      expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");
      expect(p2.isExhausted(blockerId)).toBe(false);
    });

    it("allows an enemy Blocker when the paired Unit is not a Link Unit", () => {
      const host = createMockUnit({ name: "Non-Link Host", ap: 2, hp: 5 });
      const blocker = createMockUnit({
        name: "Enemy Blocker",
        keywordEffects: [{ keyword: "Blocker" }],
      });
      const engine = GundamTestEngine.create(
        { hand: [st03CharAznable011], play: [host], resourceArea: activeResources(3) },
        { play: [blocker] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st03CharAznable011, hostId));
      expectSuccess(p1.enterBattle(hostId, "direct"));
      expectSuccess(p2.declareBlock(blockerId));

      expect(p2.isExhausted(blockerId)).toBe(true);
    });

    it("removes both the AP increase and High-Maneuver at the end of the turn", () => {
      const host = createMockUnit({
        name: "Link Host",
        ap: 2,
        hp: 5,
        linkCondition: "[Char Aznable]",
      });
      const enemy = createMockUnit({ name: "Enemy", ap: 0, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [st03CharAznable011],
          play: [host],
          resourceArea: activeResources(3),
          deck: 5,
        },
        { play: [{ card: enemy, exhausted: true }], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st03CharAznable011, hostId));
      expectSuccess(p1.enterBattle(hostId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 4 });
      expect(p1.getVisibleCard(hostId)?.keywords).toContain("HighManeuver");
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3 });
      expect(p1.getVisibleCard(hostId)?.keywords).not.toContain("HighManeuver");
    });
  });

  describe("pairing Char Aznable", () => {
    it("pairs Char beneath the Unit and applies the printed Pilot bonuses", () => {
      const host = createMockUnit({ name: "Host", ap: 2, hp: 4 });
      const engine = GundamTestEngine.create({
        hand: [st03CharAznable011],
        play: [host],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const charId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(charId, hostId));

      expect(p1.getPilotId(hostId)).toBe(charId);
      expect(p1.getCardZone(charId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 5 });
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
    });

    it("cannot pair below Char's printed Lv.3 requirement", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st03CharAznable011],
        play: [host],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.assignPilot(st03CharAznable011, hostId), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st03CharAznable011)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getPilotId(hostId)).toBeUndefined();
    });

    it("cannot pay Char's printed cost without an active Resource", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st03CharAznable011],
        play: [host],
        resourceArea: restedResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.assignPilot(st03CharAznable011, hostId), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st03CharAznable011)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getPilotId(hostId)).toBeUndefined();
    });

    it("cannot pair during a legally reached Action step", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st03CharAznable011],
        play: [host],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.assignPilot(st03CharAznable011, hostId), "WRONG_PHASE");

      expect(p1.getCardZone(st03CharAznable011)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getPilotId(hostId)).toBeUndefined();
    });
  });
});
