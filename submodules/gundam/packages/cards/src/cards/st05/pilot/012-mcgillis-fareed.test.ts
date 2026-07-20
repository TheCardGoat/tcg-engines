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
import { st05McgillisFareed012 } from "./012-mcgillis-fareed.ts";

describe("McGillis Fareed (ST05-012)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds the revealed Shield to its controller's hand when accepted", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st05McgillisFareed012] },
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
      expect(burst).toMatchObject({ controllerId: PLAYER_TWO, sourceCardId: burst.sourceCardId });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("puts the revealed Shield in trash when declined", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st05McgillisFareed012] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
    });
  });

  describe("【When Paired】 conditional rest", () => {
    it("counts two other Gjallarhorn/Tekkadan Units and rests exactly one enemy with HP3 or less", () => {
      const host = createMockUnit({ name: "Host", traits: ["earth federation"] });
      const gjallarhorn = createMockUnit({ name: "Gjallarhorn", traits: ["gjallarhorn"] });
      const tekkadan = createMockUnit({ name: "Tekkadan", traits: ["tekkadan"] });
      const enemyHp3 = createMockUnit({ name: "Enemy HP3", hp: 3 });
      const otherEnemyHp3 = createMockUnit({ name: "Other Enemy HP3", hp: 3 });
      const enemyHp4 = createMockUnit({ name: "Enemy HP4", hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05McgillisFareed012],
          play: [host, gjallarhorn, tekkadan],
          resourceArea: activeResources(4),
        },
        { play: [enemyHp3, otherEnemyHp3, enemyHp4] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId] = p1.getCardsInZone("battleArea");
      const pilotId = p1.getHand()[0]!;
      const [chosenId, otherLegalId, tooLargeId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(st05McgillisFareed012, hostId!));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: pilotId,
        minTargets: 1,
        maxTargets: 1,
        legalTargetIds: [chosenId, otherLegalId],
      });
      expectSuccess(p1.resolveEffect({ targets: [chosenId!] }));

      expect(p1.isExhausted(chosenId!)).toBe(true);
      expect(p1.isExhausted(otherLegalId!)).toBe(false);
      expect(p1.isExhausted(tooLargeId!)).toBe(false);
    });

    it("does not count the paired host among the two other Units", () => {
      const host = createMockUnit({ traits: ["gjallarhorn"] });
      const onlyOther = createMockUnit({ traits: ["tekkadan"] });
      const enemy = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05McgillisFareed012],
          play: [host, onlyOther],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st05McgillisFareed012, p1.getCardsInZone("battleArea")[0]!));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.isExhausted(enemyId)).toBe(false);
    });

    it("does not count Units with unrelated traits", () => {
      const host = createMockUnit({ traits: ["earth federation"] });
      const first = createMockUnit({ traits: ["titans"] });
      const second = createMockUnit({ traits: ["zeon"] });
      const enemy = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05McgillisFareed012],
          play: [host, first, second],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.assignPilot(st05McgillisFareed012, p1.getCardsInZone("battleArea")[0]!));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("does not prompt when all enemy Units have HP4 or more", () => {
      const host = createMockUnit();
      const first = createMockUnit({ traits: ["gjallarhorn"] });
      const second = createMockUnit({ traits: ["tekkadan"] });
      const engine = GundamTestEngine.create(
        {
          hand: [st05McgillisFareed012],
          play: [host, first, second],
          resourceArea: activeResources(4),
        },
        { play: [createMockUnit({ hp: 4 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.assignPilot(st05McgillisFareed012, p1.getCardsInZone("battleArea")[0]!));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });
  });

  it("adds its printed +2 AP/+1 HP while paired", () => {
    const engine = GundamTestEngine.create({
      hand: [st05McgillisFareed012],
      play: [createMockUnit({ ap: 2, hp: 3 })],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(st05McgillisFareed012, hostId));

    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 4, effectiveHp: 4 });
  });

  it("requires Lv.4 resources", () => {
    const engine = GundamTestEngine.create({
      hand: [st05McgillisFareed012],
      play: [createMockUnit()],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(
      p1.assignPilot(st05McgillisFareed012, p1.getCardsInZone("battleArea")[0]!),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("requires one active resource", () => {
    const engine = GundamTestEngine.create({
      hand: [st05McgillisFareed012],
      play: [createMockUnit()],
      resourceArea: restedResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(
      p1.assignPilot(st05McgillisFareed012, p1.getCardsInZone("battleArea")[0]!),
      "INSUFFICIENT_RESOURCES",
    );
  });
});
