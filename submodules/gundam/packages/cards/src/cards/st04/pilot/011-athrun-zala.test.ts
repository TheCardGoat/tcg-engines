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
import { st04AthrunZala011 } from "./011-athrun-zala.ts";

describe("Athrun Zala (ST04-011)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds Athrun Zala to hand when the Shield owner accepts Burst", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st04AthrunZala011] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      const athrunId = p2.getHand()[0]!;
      expect(p2.getCardZone(athrunId)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("puts Athrun Zala into trash when the Shield owner declines Burst", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st04AthrunZala011] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getHand()).toHaveLength(0);
      expect(p2.getBoardView().players[PLAYER_TWO]?.trashCount).toBe(1);
    });
  });

  describe("【When Linked】During this turn, this Unit may choose an active enemy Unit that is Lv.5 or lower as its attack target.", () => {
    it("lets the linked Unit attack an active enemy Unit at exactly Lv.5", () => {
      const host = createMockUnit({ name: "Host", hp: 8, linkCondition: "[Athrun Zala]" });
      const eligible = createMockUnit({ name: "Eligible", level: 5, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [st04AthrunZala011],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [eligible] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const eligibleId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st04AthrunZala011, hostId));

      expect(p1.getLegalAttackTargets(hostId)).toContain(eligibleId);
      expectSuccess(p1.enterBattle(hostId, eligibleId));
    });

    it("does not include an active enemy Unit above Lv.5", () => {
      const host = createMockUnit({ name: "Host", hp: 8, linkCondition: "[Athrun Zala]" });
      const eligible = createMockUnit({ name: "Eligible", level: 5, hp: 8 });
      const tooHigh = createMockUnit({ name: "Too High", level: 6, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [st04AthrunZala011],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [eligible, tooHigh] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const [eligibleId, tooHighId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(st04AthrunZala011, hostId));

      expect(p1.getLegalAttackTargets(hostId)).toContain(eligibleId);
      expect(p1.getLegalAttackTargets(hostId)).not.toContain(tooHighId);
      expectFailure(p1.enterBattle(hostId, tooHighId!), "INVALID_TARGET");
    });

    it("does not grant the attack option when Athrun is paired to a non-Link Unit", () => {
      const host = createMockUnit({ name: "Host", hp: 8 });
      const eligible = createMockUnit({ name: "Eligible", level: 5, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [st04AthrunZala011],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [eligible] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const eligibleId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st04AthrunZala011, hostId));

      expect(p1.getLegalAttackTargets(hostId)).not.toContain(eligibleId);
      expectFailure(p1.enterBattle(hostId, eligibleId), "INVALID_TARGET");
    });

    it("grants the option only to the Unit paired with Athrun", () => {
      const linkedHost = createMockUnit({
        name: "Linked Host",
        hp: 8,
        linkCondition: "[Athrun Zala]",
      });
      const otherFriendly = createMockUnit({ name: "Other Friendly", hp: 8 });
      const eligible = createMockUnit({ name: "Eligible", level: 5, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [st04AthrunZala011],
          play: [linkedHost, otherFriendly],
          resourceArea: activeResources(4),
        },
        { play: [eligible] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [linkedHostId, otherFriendlyId] = p1.getCardsInZone("battleArea");
      const eligibleId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st04AthrunZala011, linkedHostId!));

      expect(p1.getLegalAttackTargets(linkedHostId!)).toContain(eligibleId);
      expect(p1.getLegalAttackTargets(otherFriendlyId!)).not.toContain(eligibleId);
    });
  });

  describe("pairing Athrun Zala", () => {
    it("pays 1 Resource, pairs beneath the Unit, and grants AP+1/HP+2", () => {
      const host = createMockUnit({ name: "Host", ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [st04AthrunZala011],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const athrunId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(athrunId, hostId));

      expect(p1.getPilotId(hostId)).toBe(athrunId);
      expect(p1.getCardZone(athrunId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 5 });
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
    });

    it("cannot pair below Athrun Zala's printed Lv.4 requirement", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st04AthrunZala011],
        play: [host],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(
        p1.assignPilot(st04AthrunZala011, p1.getCardsInZone("battleArea")[0]!),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
      expect(p1.getCardZone(st04AthrunZala011)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay Athrun Zala's printed cost without an active Resource", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st04AthrunZala011],
        play: [host],
        resourceArea: restedResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(
        p1.assignPilot(st04AthrunZala011, p1.getCardsInZone("battleArea")[0]!),
        "INSUFFICIENT_RESOURCES",
      );
      expect(p1.getCardZone(st04AthrunZala011)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pair during a legally reached Action step", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st04AthrunZala011],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(
        p1.assignPilot(st04AthrunZala011, p1.getCardsInZone("battleArea")[0]!),
        "WRONG_PHASE",
      );
    });
  });
});
