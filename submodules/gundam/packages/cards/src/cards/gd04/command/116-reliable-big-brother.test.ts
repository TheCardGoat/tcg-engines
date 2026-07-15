import { describe, it, expect } from "vite-plus/test";
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
import { gd04ReliableBigBrother116 } from "./116-reliable-big-brother.ts";

describe("Reliable Big Brother (GD04-116)", () => {
  describe("【Main】Place the top 2 cards of your deck into your trash. If you do, choose 1 enemy Unit with 4 or less AP. Deal an amount of damage equal to the number of (Minerva Squad) cards placed with this effect to that enemy Unit.", () => {
    it("mills 2 cards and deals 2 damage when both milled cards are Minerva Squad cards", () => {
      const bottomSentinel = createMockUnit({
        cardNumber: "TEST-BOTTOM-SENTINEL",
        traits: ["zaft"],
      });
      const minervaA = createMockUnit({
        cardNumber: "TEST-MINERVA-A",
        traits: ["minerva squad"],
      });
      const minervaB = createMockUnit({
        cardNumber: "TEST-MINERVA-B",
        traits: ["minerva squad"],
      });
      const enemy = createMockUnit({ ap: 4, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04ReliableBigBrother116],
          resourceArea: activeResources(4),
          deck: [bottomSentinel, minervaA, minervaB],
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(commandId));

      expect(p1.getCardsInZone("deck")).toHaveLength(1);
      expect(p1.getCardZone(minervaA)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(minervaB)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: commandId,
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.getDamage(enemyId)).toBe(2);
      expect(p1.getCardsInZone("trash")).toHaveLength(3);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("loses immediately when milling the last 2 cards from its deck", () => {
      const minerva = createMockUnit({
        cardNumber: "TEST-MINERVA",
        traits: ["minerva squad"],
      });
      const nonMinerva = createMockUnit({
        cardNumber: "TEST-NON-MINERVA",
        traits: ["zaft"],
      });
      const enemy = createMockUnit({ ap: 4, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04ReliableBigBrother116],
          resourceArea: activeResources(4),
          deck: [minerva, nonMinerva],
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(gd04ReliableBigBrother116));

      expect(p1.getBoardView().winner).toBe(PLAYER_TWO);
      expect(p1.getCardsInZone("deck")).toHaveLength(0);
      expect(p1.getCardZone(minerva)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(nonMinerva)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("trash")).toHaveLength(3);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(enemyId)).toBe(0);
    });

    it("mills the cards but deals no damage when no milled cards are Minerva Squad cards", () => {
      const nonMinervaA = createMockUnit({
        cardNumber: "TEST-NON-MINERVA-A",
        traits: ["zaft"],
      });
      const nonMinervaB = createMockUnit({
        cardNumber: "TEST-NON-MINERVA-B",
        traits: ["coordinator"],
      });
      const bottomSentinel = createMockUnit({
        cardNumber: "TEST-BOTTOM-SENTINEL",
        traits: ["zaft"],
      });
      const enemy = createMockUnit({ ap: 4, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04ReliableBigBrother116],
          resourceArea: activeResources(4),
          deck: [bottomSentinel, nonMinervaA, nonMinervaB],
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(gd04ReliableBigBrother116));

      expect(p1.getCardsInZone("deck")).toHaveLength(1);
      expect(p1.getCardZone(nonMinervaA)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(nonMinervaB)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("trash")).toHaveLength(3);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(enemyId)).toBe(0);
    });

    it("does not publish a target when every enemy Unit has more than 4 AP", () => {
      const bottomSentinel = createMockUnit({
        cardNumber: "TEST-BOTTOM-SENTINEL",
        traits: ["zaft"],
      });
      const minervaA = createMockUnit({
        cardNumber: "TEST-MINERVA-A",
        traits: ["minerva squad"],
      });
      const minervaB = createMockUnit({
        cardNumber: "TEST-MINERVA-B",
        traits: ["minerva squad"],
      });
      const toughEnemy = createMockUnit({ ap: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04ReliableBigBrother116],
          resourceArea: activeResources(4),
          deck: [bottomSentinel, minervaA, minervaB],
        },
        { play: [toughEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(gd04ReliableBigBrother116));

      expect(p1.getCardsInZone("deck")).toHaveLength(1);
      expect(p1.getCardZone(minervaA)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(minervaB)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(enemyId)).toBe(0);
    });

    it("cannot be played without an active Resource for its cost", () => {
      const minervaA = createMockUnit({ traits: ["minerva squad"] });
      const minervaB = createMockUnit({ traits: ["minerva squad"] });
      const enemy = createMockUnit({ ap: 4, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04ReliableBigBrother116],
          resourceArea: restedResources(4),
          deck: [minervaA, minervaB],
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(gd04ReliableBigBrother116), "INSUFFICIENT_RESOURCES");

      expect(p1.getCardsInZone("deck")).toHaveLength(2);
    });
  });

  it("can be paired as Heine Westenfluss instead of activating the Command effect", () => {
    const host = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create({
      hand: [gd04ReliableBigBrother116],
      play: [host],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 2, effectiveHp: 5 });
  });
});
