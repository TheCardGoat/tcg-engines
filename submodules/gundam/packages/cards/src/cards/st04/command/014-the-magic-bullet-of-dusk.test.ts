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
import { st04TheMagicBulletOfDusk014 } from "./014-the-magic-bullet-of-dusk.ts";

describe("The Magic Bullet of Dusk (ST04-014)", () => {
  describe("【Main】/【Action】Choose 1 friendly Unit that is Lv.2 or lower. It gains <First Strike> during this turn.", () => {
    it("asks for exactly one eligible friendly Unit, grants First Strike, and moves to trash", () => {
      const firstFriendly = createMockUnit({ name: "First Friendly", level: 2 });
      const secondFriendly = createMockUnit({ name: "Second Friendly", level: 1 });
      const engine = GundamTestEngine.create({
        hand: [st04TheMagicBulletOfDusk014],
        play: [firstFriendly, secondFriendly],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;
      const [firstFriendlyId, secondFriendlyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(commandId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: commandId,
        legalTargetIds: expect.arrayContaining([firstFriendlyId, secondFriendlyId]),
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [secondFriendlyId!] }));

      expect(p1.getVisibleCard(firstFriendlyId!)?.keywords).not.toContain("FirstStrike");
      expect(p1.getVisibleCard(secondFriendlyId!)?.keywords).toContain("FirstStrike");
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("includes a friendly Unit at exactly Lv.2", () => {
      const friendly = createMockUnit({ name: "Boundary Friendly", level: 2 });
      const engine = GundamTestEngine.create({
        hand: [st04TheMagicBulletOfDusk014],
        play: [friendly],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(st04TheMagicBulletOfDusk014, { targets: [friendlyId] }));

      expect(p1.getVisibleCard(friendlyId)?.keywords).toContain("FirstStrike");
    });

    it("lets the attacking Unit deal battle damage first and avoid retaliation", () => {
      const friendly = createMockUnit({ name: "Friendly", level: 2, ap: 3, hp: 3 });
      const enemy = createMockUnit({ name: "Enemy", ap: 3, hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [st04TheMagicBulletOfDusk014],
          play: [friendly],
          resourceArea: activeResources(3),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(st04TheMagicBulletOfDusk014, { targets: [friendlyId] }));
      expectSuccess(p1.enterBattle(friendlyId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getCardZone(friendlyId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getDamage(friendlyId)).toBe(0);
    });

    it("can be played in a legally reached Action step", () => {
      const friendly = createMockUnit({ name: "Friendly", level: 2 });
      const engine = GundamTestEngine.create({
        hand: [st04TheMagicBulletOfDusk014],
        play: [friendly],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(st04TheMagicBulletOfDusk014, { targets: [friendlyId] }));

      expect(p1.getVisibleCard(friendlyId)?.keywords).toContain("FirstStrike");
    });

    it("rejects a friendly Unit above Lv.2", () => {
      const eligible = createMockUnit({ name: "Eligible", level: 2 });
      const tooHigh = createMockUnit({ name: "Too High", level: 3 });
      const engine = GundamTestEngine.create({
        hand: [st04TheMagicBulletOfDusk014],
        play: [eligible, tooHigh],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [, tooHighId] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(st04TheMagicBulletOfDusk014, { targets: [tooHighId!] }),
        "INVALID_TARGET",
      );

      expect(p1.getVisibleCard(tooHighId!)?.keywords).not.toContain("FirstStrike");
      expect(p1.getCardZone(st04TheMagicBulletOfDusk014)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("rejects an enemy Unit even when it is Lv.2 or lower", () => {
      const friendly = createMockUnit({ name: "Friendly", level: 2 });
      const enemy = createMockUnit({ name: "Enemy", level: 2 });
      const engine = GundamTestEngine.create(
        {
          hand: [st04TheMagicBulletOfDusk014],
          play: [friendly],
          resourceArea: activeResources(3),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(st04TheMagicBulletOfDusk014, { targets: [enemyId] }),
        "INVALID_TARGET",
      );

      expect(p2.getVisibleCard(enemyId)?.keywords).not.toContain("FirstStrike");
    });

    it("cannot be played when no eligible friendly Unit exists", () => {
      const tooHigh = createMockUnit({ name: "Too High", level: 3 });
      const engine = GundamTestEngine.create({
        hand: [st04TheMagicBulletOfDusk014],
        play: [tooHigh],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st04TheMagicBulletOfDusk014), "NO_LEGAL_TARGETS");
      expect(p1.getCardZone(st04TheMagicBulletOfDusk014)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("expires the First Strike grant when the turn ends", () => {
      const friendly = createMockUnit({ name: "Friendly", level: 2 });
      const engine = GundamTestEngine.create({
        hand: [st04TheMagicBulletOfDusk014],
        play: [friendly],
        resourceArea: activeResources(3),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(st04TheMagicBulletOfDusk014, { targets: [friendlyId] }));
      expect(p1.getVisibleCard(friendlyId)?.keywords).toContain("FirstStrike");
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p1.getVisibleCard(friendlyId)?.keywords).not.toContain("FirstStrike");
    });

    it("cannot be played during the Block Step before an Action step begins", () => {
      const attacker = createMockUnit({ name: "Attacker", level: 2, hp: 5 });
      const friendly = createMockUnit({ name: "Friendly", level: 2 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        {
          hand: [st04TheMagicBulletOfDusk014],
          play: [friendly],
          resourceArea: activeResources(3),
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const friendlyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectFailure(
        p2.playCommand(st04TheMagicBulletOfDusk014, { targets: [friendlyId] }),
        "WRONG_PHASE",
      );

      expect(p2.getCardZone(st04TheMagicBulletOfDusk014)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("cannot be played below its printed Lv.3 requirement", () => {
      const friendly = createMockUnit({ name: "Friendly", level: 2 });
      const engine = GundamTestEngine.create({
        hand: [st04TheMagicBulletOfDusk014],
        play: [friendly],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st04TheMagicBulletOfDusk014), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st04TheMagicBulletOfDusk014)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without an active Resource", () => {
      const friendly = createMockUnit({ name: "Friendly", level: 2 });
      const engine = GundamTestEngine.create({
        hand: [st04TheMagicBulletOfDusk014],
        play: [friendly],
        resourceArea: restedResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st04TheMagicBulletOfDusk014), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st04TheMagicBulletOfDusk014)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【Pilot】[Miguel Ayman]", () => {
    it("can be paired as Miguel Ayman and grants AP+0/HP+1 instead of resolving the Command", () => {
      const host = createMockUnit({ name: "Host", ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [st04TheMagicBulletOfDusk014],
        play: [host],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommandAsPilot(commandId, hostId));

      expect(p1.getPilotId(hostId)).toBe(commandId);
      expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 2, effectiveHp: 4 });
    });
  });
});
