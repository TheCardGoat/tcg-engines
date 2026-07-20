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
import { st04StrikerPack012 } from "./012-striker-pack.ts";

const SWORD_STRIKE_OPTION = 0;
const LAUNCHER_STRIKE_OPTION = 1;

describe("Striker Pack (ST04-012)", () => {
  describe("【Burst】If you have no (Earth Alliance) Unit tokens in play, deploy 1 [Aile Strike Gundam]((Earth Alliance)·AP3·HP3·<Blocker>) Unit token.", () => {
    it("deploys a visible active AP3/HP3 Aile Strike Gundam Blocker", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st04StrikerPack012] },
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

      const tokenId = p2.getCardsInZone("battleArea")[0]!;
      expect(p2.getVisibleCard(tokenId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
      expect(p2.getVisibleCard(tokenId)?.keywords).toContain("Blocker");
      expect(p2.isExhausted(tokenId)).toBe(false);
      expect(p2.getCardZone(st04StrikerPack012)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("lets the Burst-deployed Aile Strike Gundam block another attack", () => {
      const firstAttacker = createMockUnit({ name: "First Attacker", ap: 1, hp: 5 });
      const secondAttacker = createMockUnit({ name: "Second Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [firstAttacker, secondAttacker] },
        { shieldArea: [st04StrikerPack012] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [firstAttackerId, secondAttackerId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(firstAttackerId!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      const tokenId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(secondAttackerId!, "direct"));
      expectSuccess(p2.declareBlock(tokenId));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ blockerId: tokenId });
      expect(p2.isExhausted(tokenId)).toBe(true);
    });

    it("does not deploy a second token when an Earth Alliance Unit token is already in play", () => {
      const firstAttacker = createMockUnit({ name: "First Attacker", ap: 1, hp: 5 });
      const secondAttacker = createMockUnit({ name: "Second Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [firstAttacker, secondAttacker] },
        { shieldArea: [st04StrikerPack012, st04StrikerPack012] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [firstAttackerId, secondAttackerId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(firstAttackerId!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      let burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the first Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      expect(p2.getCardsInZone("battleArea")).toHaveLength(1);

      expectSuccess(p1.enterBattle(secondAttackerId!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the second Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getCardsInZone("battleArea")).toHaveLength(1);
      expect(p2.getBoardView().players[PLAYER_TWO]?.trashCount).toBe(2);
    });

    it("deploys no token and puts the Shield into trash when Burst is declined", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st04StrikerPack012] },
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

      expect(p2.getCardsInZone("battleArea")).toHaveLength(0);
      expect(p2.getBoardView().players[PLAYER_TWO]?.trashCount).toBe(1);
    });
  });

  describe("【Main】If you have no (Earth Alliance) Unit tokens in play, deploy 1 [Sword Strike Gundam]((Earth Alliance)·AP4·HP2·<Blocker>) or 1 [Launcher Strike Gundam]((Earth Alliance)·AP2·HP4·<Blocker>) Unit token.", () => {
    it("asks the controller to choose one option and deploys only Sword Strike Gundam", () => {
      const engine = GundamTestEngine.create({
        hand: [st04StrikerPack012],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(commandId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "chooseOne",
        controllerId: PLAYER_ONE,
        options: [
          { index: SWORD_STRIKE_OPTION, label: "Sword Strike Gundam" },
          { index: LAUNCHER_STRIKE_OPTION, label: "Launcher Strike Gundam" },
        ],
      });
      expectSuccess(p1.resolveEffect({ chooseOneAnswers: { 0: SWORD_STRIKE_OPTION } }));

      const tokenId = p1.getCardsInZone("battleArea")[0]!;
      expect(p1.getVisibleCard(tokenId)).toMatchObject({ effectiveAp: 4, effectiveHp: 2 });
      expect(p1.getVisibleCard(tokenId)?.keywords).toContain("Blocker");
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("deploys only Launcher Strike Gundam when the second option is chosen", () => {
      const engine = GundamTestEngine.create({
        hand: [st04StrikerPack012],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.playCommand(st04StrikerPack012));
      expectSuccess(p1.resolveEffect({ chooseOneAnswers: { 0: LAUNCHER_STRIKE_OPTION } }));

      const tokenId = p1.getCardsInZone("battleArea")[0]!;
      expect(p1.getVisibleCard(tokenId)).toMatchObject({ effectiveAp: 2, effectiveHp: 4 });
      expect(p1.getVisibleCard(tokenId)?.keywords).toContain("Blocker");
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });

    it("requires an explicit option choice", () => {
      const engine = GundamTestEngine.create({
        hand: [st04StrikerPack012],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.playCommand(st04StrikerPack012));
      expectFailure(p1.resolveEffect({}), "MISSING_CHOOSE_ONE_ANSWER");

      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("deploys no second token when an Earth Alliance Unit token is already in play", () => {
      const engine = GundamTestEngine.create({
        hand: [st04StrikerPack012, st04StrikerPack012],
        resourceArea: activeResources(8),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [firstCommandId, secondCommandId] = p1.getHand();

      expectSuccess(p1.playCommand(firstCommandId!));
      expectSuccess(p1.resolveEffect({ chooseOneAnswers: { 0: SWORD_STRIKE_OPTION } }));
      expectSuccess(p1.playCommand(secondCommandId!));

      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
      expect(p1.getCardZone(firstCommandId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(secondCommandId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("cannot be played in a legally reached Action step", () => {
      const engine = GundamTestEngine.create({
        hand: [st04StrikerPack012],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.playCommand(st04StrikerPack012), "WRONG_TIMING");

      expect(p1.getCardZone(st04StrikerPack012)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played below its printed Lv.4 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [st04StrikerPack012],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st04StrikerPack012), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st04StrikerPack012)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without 2 active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st04StrikerPack012],
        resourceArea: restedResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st04StrikerPack012), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st04StrikerPack012)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
