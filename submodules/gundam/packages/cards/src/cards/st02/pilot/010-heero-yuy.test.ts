import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  restedResources,
} from "@tcg/gundam-engine";
import { st02HeeroYuy010 } from "./010-heero-yuy.ts";

describe("Heero Yuy (ST02-010)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds Heero Yuy to hand when its controller accepts the revealed Shield prompt", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st02HeeroYuy010] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Heero Yuy's Burst choice");
      const shieldId = burst.sourceCardId;
      expect(burst.directiveIndex).toBe(-1);
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

      expect(p2.getHand()).toContain(shieldId);
      expect(p2.getCardZone(shieldId)).toBe(`hand:${PLAYER_TWO}`);
      expect(p2.getBoardView().pendingChoice).toBeUndefined();
    });

    it("puts Heero Yuy into trash when its controller declines Burst", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st02HeeroYuy010] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Heero Yuy's Burst choice");
      const shieldId = burst.sourceCardId;
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getHand()).not.toContain(shieldId);
      expect(p2.getCardZone(shieldId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getBoardView().pendingChoice).toBeUndefined();
    });
  });

  describe("【During Link】This Unit gets AP+1 and HP+1.", () => {
    it("adds AP+1 and HP+1 to the linked host in addition to Heero's Pilot bonuses", () => {
      const host = createMockUnit({
        name: "Linked Host",
        ap: 2,
        hp: 4,
        linkCondition: "[Heero Yuy]",
      });
      const ally = createMockUnit({ name: "Ally", ap: 2, hp: 4 });
      const engine = GundamTestEngine.create({
        hand: [st02HeeroYuy010],
        play: [host, ally],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [hostId, allyId] = p1.getCardsInZone("battleArea");
      const heeroId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(heeroId, hostId!));

      expect(p1.getPilotId(hostId!)).toBe(heeroId);
      expect(p1.getCardZone(heeroId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId!)).toMatchObject({ effectiveAp: 5, effectiveHp: 6 });
      expect(p1.getVisibleCard(allyId!)).toMatchObject({ effectiveAp: 2, effectiveHp: 4 });
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
    });

    it("does not add the During Link modifier when Heero does not satisfy the host's Link Condition", () => {
      const host = createMockUnit({
        name: "Non-Link Host",
        ap: 2,
        hp: 4,
        linkCondition: "[Zechs Merquise]",
      });
      const engine = GundamTestEngine.create({
        hand: [st02HeeroYuy010],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st02HeeroYuy010, hostId));

      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 4, effectiveHp: 5 });
    });
  });

  describe("pairing Heero Yuy", () => {
    it("cannot pair below Heero's printed Lv.4 requirement", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st02HeeroYuy010],
        play: [host],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.assignPilot(st02HeeroYuy010, hostId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getCardZone(st02HeeroYuy010)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getPilotId(hostId)).toBeUndefined();
    });

    it("cannot pay Heero's printed cost without an active Resource", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st02HeeroYuy010],
        play: [host],
        resourceArea: restedResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.assignPilot(st02HeeroYuy010, hostId), "INSUFFICIENT_RESOURCES");

      expect(p1.getCardZone(st02HeeroYuy010)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getPilotId(hostId)).toBeUndefined();
    });

    it("cannot pair during a legally reached Action Step", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st02HeeroYuy010],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.assignPilot(st02HeeroYuy010, hostId), "WRONG_PHASE");

      expect(p1.getCardZone(st02HeeroYuy010)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getPilotId(hostId)).toBeUndefined();
    });
  });
});
