import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockResource,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  restedResources,
} from "@tcg/gundam-engine";
import { st09ShinnAsuka008 } from "./008-shinn-asuka.ts";

describe("Shinn Asuka (ST09-008)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds Shinn Asuka to hand when its controller accepts the revealed Shield prompt", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st09ShinnAsuka008] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected visible Burst choice");
      expect(burst).toMatchObject({ controllerId: PLAYER_TWO, directiveIndex: -1 });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`hand:${PLAYER_TWO}`);
      expect(p2.getBoardView().pendingChoice).toBeUndefined();
    });

    it("puts Shinn Asuka into trash when its controller declines Burst", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st09ShinnAsuka008] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected visible Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getBoardView().pendingChoice).toBeUndefined();
    });
  });

  describe("【Attack】If this is a (Minerva Squad) Unit, choose 1 of your Resources. Set it as active.", () => {
    // A paired Lv.4/cost-1 Pilot necessarily leaves friendly Resources in play,
    // so this mandatory exact-one choice has no reachable no-legal-target branch.
    it("publishes an exact-one controller/source choice of every friendly Resource and sets only the chosen identity active", () => {
      const host = createMockUnit({ name: "Minerva Host", traits: ["minerva squad"], hp: 8 });
      const defender = createMockUnit({ name: "Defender", ap: 0, hp: 8 });
      const firstRested = createMockResource({ name: "First Rested Resource" });
      const chosenRested = createMockResource({ name: "Chosen Rested Resource" });
      const enemyResource = createMockResource({ name: "Enemy Resource" });
      const engine = GundamTestEngine.create(
        {
          hand: [st09ShinnAsuka008],
          play: [host],
          resourceArea: [
            ...activeResources(4),
            { card: firstRested, exhausted: true },
            { card: chosenRested, exhausted: true },
          ],
        },
        {
          play: [{ card: defender, exhausted: true }],
          resourceArea: [{ card: enemyResource, exhausted: true }],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const shinnId = p1.getHand()[0]!;
      const friendlyResourceIds = p1.getCardsInZone("resourceArea");
      const firstRestedId = friendlyResourceIds.at(-2)!;
      const chosenRestedId = friendlyResourceIds.at(-1)!;
      const enemyResourceId = p2.getCardsInZone("resourceArea")[0]!;

      expectSuccess(p1.assignPilot(shinnId, hostId));
      expectSuccess(p1.enterBattle(hostId, defenderId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: shinnId,
        legalTargetIds: expect.arrayContaining(friendlyResourceIds),
        minTargets: 1,
        maxTargets: 1,
      });
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") throw new Error("Expected a Resource choice");
      expect(choice.legalTargetIds).toHaveLength(friendlyResourceIds.length);
      expect(choice.legalTargetIds).not.toContain(enemyResourceId);
      expectSuccess(p1.resolveEffect({ targets: [chosenRestedId] }));

      expect(p1.isExhausted(firstRestedId)).toBe(true);
      expect(p1.isExhausted(chosenRestedId)).toBe(false);
      expect(p1.getPilotId(hostId)).toBe(shinnId);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expectSuccess(p2.passBlock());
    });

    it("may choose a friendly Resource that is already active", () => {
      const host = createMockUnit({ name: "Minerva Host", traits: ["minerva squad"], hp: 8 });
      const defender = createMockUnit({ name: "Defender", ap: 0, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [st09ShinnAsuka008],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st09ShinnAsuka008, hostId));
      const activeResourceId = p1.getCardsInZone("resourceArea").find((id) => !p1.isExhausted(id));
      if (!activeResourceId) throw new Error("Expected an active Resource");
      expectSuccess(p1.enterBattle(hostId, defenderId));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") throw new Error("Expected a Resource choice");
      expect(choice.legalTargetIds).toContain(activeResourceId);
      expectSuccess(p1.resolveEffect({ targets: [activeResourceId] }));

      expect(p1.isExhausted(activeResourceId)).toBe(false);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("rejects an opponent's Resource, then accepts a friendly Resource and continues", () => {
      const host = createMockUnit({ name: "Minerva Host", traits: ["minerva squad"], hp: 8 });
      const defender = createMockUnit({ name: "Defender", ap: 0, hp: 8 });
      const enemyResource = createMockResource({ name: "Enemy Resource" });
      const engine = GundamTestEngine.create(
        {
          hand: [st09ShinnAsuka008],
          play: [host],
          resourceArea: activeResources(4),
        },
        {
          play: [{ card: defender, exhausted: true }],
          resourceArea: [{ card: enemyResource, exhausted: true }],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const enemyResourceId = p2.getCardsInZone("resourceArea")[0]!;

      expectSuccess(p1.assignPilot(st09ShinnAsuka008, hostId));
      const friendlyResourceId = p1.getCardsInZone("resourceArea")[0]!;
      expectSuccess(p1.enterBattle(hostId, defenderId));
      expectFailure(p1.resolveEffect({ targets: [enemyResourceId] }), "ILLEGAL_TARGET");
      expect(p2.isExhausted(enemyResourceId)).toBe(true);
      expectSuccess(p1.resolveEffect({ targets: [friendlyResourceId] }));
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("rejects a friendly non-Resource card, then accepts a Resource", () => {
      const host = createMockUnit({ name: "Minerva Host", traits: ["minerva squad"], hp: 8 });
      const ally = createMockUnit({ name: "Friendly Unit" });
      const defender = createMockUnit({ name: "Defender", ap: 0, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [st09ShinnAsuka008],
          play: [host, ally],
          resourceArea: activeResources(4),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId, allyId] = p1.getCardsInZone("battleArea");
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const resourceId = p1.getCardsInZone("resourceArea")[0]!;

      expectSuccess(p1.assignPilot(st09ShinnAsuka008, hostId!));
      expectSuccess(p1.enterBattle(hostId!, defenderId));
      expectFailure(p1.resolveEffect({ targets: [allyId!] }), "ILLEGAL_TARGET");
      expectSuccess(p1.resolveEffect({ targets: [resourceId] }));

      expect(p1.getCardZone(allyId!)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("enforces the exact-one target bound, then resolves the chosen Resource", () => {
      const host = createMockUnit({ name: "Minerva Host", traits: ["minerva squad"], hp: 8 });
      const defender = createMockUnit({ name: "Defender", ap: 0, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [st09ShinnAsuka008],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const [firstResourceId, secondResourceId] = p1.getCardsInZone("resourceArea");

      expectSuccess(p1.assignPilot(st09ShinnAsuka008, hostId));
      expectSuccess(p1.enterBattle(hostId, defenderId));
      expectFailure(
        p1.resolveEffect({ targets: [firstResourceId!, secondResourceId!] }),
        "WRONG_TARGET_COUNT",
      );
      expectSuccess(p1.resolveEffect({ targets: [firstResourceId!] }));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("does not trigger when Shinn is paired with a Unit without the (Minerva Squad) trait", () => {
      const host = createMockUnit({ name: "Non-Minerva Host", traits: ["zaft"], hp: 8 });
      const defender = createMockUnit({ name: "Defender", ap: 0, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [st09ShinnAsuka008],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const restedAfterPair = p1.getCardsInZone("resourceArea");

      expectSuccess(p1.assignPilot(st09ShinnAsuka008, hostId));
      expectSuccess(p1.enterBattle(hostId, defenderId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(restedAfterPair.filter((id) => p1.isExhausted(id))).toHaveLength(1);
    });
  });

  describe("pairing Shinn Asuka", () => {
    it("pays 1 Resource, pairs beneath the Unit, and grants AP+3/HP+0", () => {
      const host = createMockUnit({ name: "Host", ap: 2, hp: 4 });
      const engine = GundamTestEngine.create({
        hand: [st09ShinnAsuka008],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const shinnId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(shinnId, hostId));

      expect(p1.getPilotId(hostId)).toBe(shinnId);
      expect(p1.getCardZone(shinnId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 5, effectiveHp: 4 });
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
    });

    it("cannot pair below Shinn's printed Lv.4 requirement", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st09ShinnAsuka008],
        play: [host],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.assignPilot(st09ShinnAsuka008, hostId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getCardZone(st09ShinnAsuka008)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getPilotId(hostId)).toBeUndefined();
    });

    it("cannot pay Shinn's printed cost without an active Resource", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st09ShinnAsuka008],
        play: [host],
        resourceArea: restedResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.assignPilot(st09ShinnAsuka008, hostId), "INSUFFICIENT_RESOURCES");

      expect(p1.getCardZone(st09ShinnAsuka008)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getPilotId(hostId)).toBeUndefined();
    });

    it("cannot pair during a legally reached Action Step", () => {
      const host = createMockUnit({ name: "Host" });
      const engine = GundamTestEngine.create({
        hand: [st09ShinnAsuka008],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.assignPilot(st09ShinnAsuka008, hostId), "WRONG_PHASE");

      expect(p1.getCardZone(st09ShinnAsuka008)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getPilotId(hostId)).toBeUndefined();
    });
  });
});
