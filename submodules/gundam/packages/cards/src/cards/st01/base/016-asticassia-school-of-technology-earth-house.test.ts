import { describe, expect, it } from "vite-plus/test";
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
import { st01AsticassiaSchoolOfTechnologyEarthHouse016 } from "./016-asticassia-school-of-technology-earth-house.ts";

describe("Asticassia School of Technology, Earth House (ST01-016)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("deploys the revealed Shield into its owner's Base section", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st01AsticassiaSchoolOfTechnologyEarthHouse016] },
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
      expect(burst).toMatchObject({
        controllerId: PLAYER_TWO,
        prompt: "【Burst】Deploy this card.",
      });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getCardZone(st01AsticassiaSchoolOfTechnologyEarthHouse016)).toBe(
        `baseSection:${PLAYER_TWO}`,
      );
    });

    it("moves the revealed Shield to trash when its owner declines", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st01AsticassiaSchoolOfTechnologyEarthHouse016] },
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

      expect(p2.getCardZone(st01AsticassiaSchoolOfTechnologyEarthHouse016)).toBe(
        `trash:${PLAYER_TWO}`,
      );
    });
  });

  describe("【Deploy】Add 1 of your Shields to your hand.", () => {
    it("reduces the Shield count by one while Earth House enters the Base section", () => {
      const engine = GundamTestEngine.create({
        hand: [st01AsticassiaSchoolOfTechnologyEarthHouse016],
        shieldArea: [
          createMockUnit({ name: "First Shield" }),
          createMockUnit({ name: "Second Shield" }),
        ],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(st01AsticassiaSchoolOfTechnologyEarthHouse016));

      expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(1);
      expect(p1.getHand()).toHaveLength(handBefore);
      expect(p1.getCardZone(st01AsticassiaSchoolOfTechnologyEarthHouse016)).toBe(
        `baseSection:${PLAYER_ONE}`,
      );
    });

    it("still deploys when there is no Shield to add", () => {
      const engine = GundamTestEngine.create({
        hand: [st01AsticassiaSchoolOfTechnologyEarthHouse016],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployBase(st01AsticassiaSchoolOfTechnologyEarthHouse016));

      expect(p1.getHand()).toHaveLength(0);
      expect(p1.getCardZone(st01AsticassiaSchoolOfTechnologyEarthHouse016)).toBe(
        `baseSection:${PLAYER_ONE}`,
      );
    });

    it("cannot be deployed below its printed Lv.2 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [st01AsticassiaSchoolOfTechnologyEarthHouse016],
        resourceArea: activeResources(1),
      });

      expectFailure(
        engine.asPlayer(PLAYER_ONE).deployBase(st01AsticassiaSchoolOfTechnologyEarthHouse016),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });

    it("cannot pay its printed deployment cost without an active Resource", () => {
      const engine = GundamTestEngine.create({
        hand: [st01AsticassiaSchoolOfTechnologyEarthHouse016],
        resourceArea: activeResources(2).map((entry) => ({ ...entry, exhausted: true })),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(
        p1.deployBase(st01AsticassiaSchoolOfTechnologyEarthHouse016),
        "INSUFFICIENT_RESOURCES",
      );
      expect(p1.getCardZone(st01AsticassiaSchoolOfTechnologyEarthHouse016)).toBe(
        `hand:${PLAYER_ONE}`,
      );
    });
  });

  describe("【Activate･Main】Rest this Base：All friendly Link Units get AP+1 during this turn.", () => {
    it("rests Earth House and gives every friendly Link Unit AP+1 but no other Unit", () => {
      const firstLinkHost = createMockUnit({ ap: 2, hp: 3, linkCondition: "[Test Pilot]" });
      const secondLinkHost = createMockUnit({ ap: 3, hp: 4, linkCondition: "[Test Pilot]" });
      const nonLinkUnit = createMockUnit({ ap: 4, hp: 5 });
      const firstPilot = createMockPilot({
        name: "Test Pilot Alpha",
        cost: 0,
        apBonus: 0,
        hpBonus: 0,
      });
      const secondPilot = createMockPilot({
        name: "Test Pilot Beta",
        cost: 0,
        apBonus: 0,
        hpBonus: 0,
      });
      const engine = GundamTestEngine.create({
        hand: [firstPilot, secondPilot],
        baseSection: [st01AsticassiaSchoolOfTechnologyEarthHouse016],
        play: [firstLinkHost, secondLinkHost, nonLinkUnit],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [firstLinkId, secondLinkId, nonLinkId] = p1.getCardsInZone("battleArea");
      const baseId = p1.getCardsInZone("baseSection")[0]!;

      expectSuccess(p1.assignPilot(firstPilot, firstLinkId!));
      expectSuccess(p1.assignPilot(secondPilot, secondLinkId!));
      expectSuccess(p1.activateBaseAbility(st01AsticassiaSchoolOfTechnologyEarthHouse016));

      expect(p1.isExhausted(baseId)).toBe(true);
      expect(p1.getVisibleCard(firstLinkId!)?.effectiveAp).toBe(3);
      expect(p1.getVisibleCard(secondLinkId!)?.effectiveAp).toBe(4);
      expect(p1.getVisibleCard(nonLinkId!)?.effectiveAp).toBe(4);
    });

    it("does not affect an enemy Link Unit", () => {
      const friendly = createMockUnit({ ap: 2, hp: 3 });
      const enemyHost = createMockUnit({ ap: 3, hp: 4, linkCondition: "[Enemy Pilot]" });
      const enemyPilot = createMockPilot({ name: "Enemy Pilot", cost: 0, apBonus: 0, hpBonus: 0 });
      const engine = GundamTestEngine.create(
        {
          baseSection: [st01AsticassiaSchoolOfTechnologyEarthHouse016],
          play: [friendly],
          deck: 5,
        },
        {
          hand: [enemyPilot],
          play: [enemyHost],
          resourceArea: activeResources(1),
          deck: 5,
        },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.assignPilot(enemyPilot, enemyId));
      expectSuccess(p2.passPhase());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.activateBaseAbility(st01AsticassiaSchoolOfTechnologyEarthHouse016));

      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(3);
    });

    it("cannot pay the rest cost while Earth House is already rested", () => {
      const engine = GundamTestEngine.create({
        baseSection: [{ card: st01AsticassiaSchoolOfTechnologyEarthHouse016, exhausted: true }],
      });

      expectFailure(
        engine
          .asPlayer(PLAYER_ONE)
          .activateBaseAbility(st01AsticassiaSchoolOfTechnologyEarthHouse016),
        "CARD_EXHAUSTED",
      );
    });

    it("cannot activate outside its Main timing", () => {
      const engine = GundamTestEngine.create(
        { baseSection: [st01AsticassiaSchoolOfTechnologyEarthHouse016] },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(
        p1.activateBaseAbility(st01AsticassiaSchoolOfTechnologyEarthHouse016),
        "WRONG_PHASE",
      );
    });

    it("expires the AP increase when the turn ends", () => {
      const host = createMockUnit({ ap: 2, hp: 3, linkCondition: "[Test Pilot]" });
      const pilot = createMockPilot({ name: "Test Pilot", cost: 0, apBonus: 0, hpBonus: 0 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          baseSection: [st01AsticassiaSchoolOfTechnologyEarthHouse016],
          play: [host],
          resourceArea: activeResources(1),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, hostId));
      expectSuccess(p1.activateBaseAbility(st01AsticassiaSchoolOfTechnologyEarthHouse016));
      expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(3);
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(2);
    });
  });
});
