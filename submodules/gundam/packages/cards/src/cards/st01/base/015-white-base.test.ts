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
import { st01WhiteBase015 } from "./015-white-base.ts";

describe("White Base (ST01-015)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("deploys the revealed Shield into its owner's Base section", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st01WhiteBase015] },
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

      expect(p2.getCardZone(st01WhiteBase015)).toBe(`baseSection:${PLAYER_TWO}`);
    });

    it("moves the revealed Shield to trash when its owner declines", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st01WhiteBase015] },
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

      expect(p2.getCardZone(st01WhiteBase015)).toBe(`trash:${PLAYER_TWO}`);
    });
  });

  describe("【Deploy】Add 1 of your Shields to your hand.", () => {
    it("reduces the Shield count by one while White Base enters the Base section", () => {
      const engine = GundamTestEngine.create({
        hand: [st01WhiteBase015],
        shieldArea: [
          createMockUnit({ name: "First Shield" }),
          createMockUnit({ name: "Second Shield" }),
        ],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(st01WhiteBase015));

      expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(1);
      expect(p1.getHand()).toHaveLength(handBefore);
      expect(p1.getCardZone(st01WhiteBase015)).toBe(`baseSection:${PLAYER_ONE}`);
    });

    it("still deploys when there is no Shield to add", () => {
      const engine = GundamTestEngine.create({
        hand: [st01WhiteBase015],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployBase(st01WhiteBase015));

      expect(p1.getHand()).toHaveLength(0);
      expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(0);
      expect(p1.getCardZone(st01WhiteBase015)).toBe(`baseSection:${PLAYER_ONE}`);
    });

    it("cannot be deployed below its printed Lv.3 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [st01WhiteBase015],
        resourceArea: activeResources(2),
      });

      expectFailure(
        engine.asPlayer(PLAYER_ONE).deployBase(st01WhiteBase015),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });

    it("cannot pay its printed deployment cost with only one active Resource", () => {
      const engine = GundamTestEngine.create({
        hand: [st01WhiteBase015],
        resourceArea: [
          ...activeResources(1),
          ...activeResources(2).map((entry) => ({ ...entry, exhausted: true })),
        ],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployBase(st01WhiteBase015), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st01WhiteBase015)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【Activate･Main】【Once per Turn】②：Deploy 1 [Gundam]((White Base Team)･AP3･HP3) Unit token if you have no Units in play, deploy 1 [Guncannon]((White Base Team)･AP2･HP2) Unit token if you have only 1 Unit in play, or deploy 1 [Guntank]((White Base Team)･AP1･HP1) Unit token if you have 2 or more Units in play.", () => {
    it("pays two Resources and deploys an active AP3/HP3 Gundam token with no Units in play", () => {
      const engine = GundamTestEngine.create({
        baseSection: [st01WhiteBase015],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.activateBaseAbility(st01WhiteBase015));

      const tokenId = p1.getCardsInZone("battleArea")[0]!;
      expect(p1.getVisibleCard(tokenId)).toMatchObject({
        effectiveAp: 3,
        effectiveHp: 3,
        exhausted: false,
      });
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
    });

    it("deploys an active AP2/HP2 Guncannon token with exactly one Unit in play", () => {
      const ally = createMockUnit({ ap: 4, hp: 4 });
      const engine = GundamTestEngine.create({
        baseSection: [st01WhiteBase015],
        play: [ally],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const before = p1.getCardsInZone("battleArea");

      expectSuccess(p1.activateBaseAbility(st01WhiteBase015));

      const tokenId = p1.getCardsInZone("battleArea").find((id) => !before.includes(id));
      expect(tokenId).toBeDefined();
      expect(p1.getVisibleCard(tokenId!)).toMatchObject({
        effectiveAp: 2,
        effectiveHp: 2,
        exhausted: false,
      });
    });

    it("deploys an active AP1/HP1 Guntank token with two or more Units in play", () => {
      const engine = GundamTestEngine.create({
        baseSection: [st01WhiteBase015],
        play: [createMockUnit(), createMockUnit()],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const before = p1.getCardsInZone("battleArea");

      expectSuccess(p1.activateBaseAbility(st01WhiteBase015));

      const tokenId = p1.getCardsInZone("battleArea").find((id) => !before.includes(id));
      expect(tokenId).toBeDefined();
      expect(p1.getVisibleCard(tokenId!)).toMatchObject({
        effectiveAp: 1,
        effectiveHp: 1,
        exhausted: false,
      });
    });

    it("cannot activate without two active Resources", () => {
      const engine = GundamTestEngine.create({
        baseSection: [st01WhiteBase015],
        resourceArea: activeResources(1),
      });

      expectFailure(
        engine.asPlayer(PLAYER_ONE).activateBaseAbility(st01WhiteBase015),
        "INSUFFICIENT_RESOURCES",
      );
    });

    it("cannot activate twice in the same turn", () => {
      const engine = GundamTestEngine.create({
        baseSection: [st01WhiteBase015],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.activateBaseAbility(st01WhiteBase015));
      expectFailure(p1.activateBaseAbility(st01WhiteBase015), "ABILITY_LIMIT_REACHED");
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });

    it("cannot activate outside its Main timing", () => {
      const engine = GundamTestEngine.create(
        { baseSection: [st01WhiteBase015], resourceArea: activeResources(2) },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.activateBaseAbility(st01WhiteBase015), "WRONG_PHASE");
    });
  });
});
