import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04HallelujahHaptism090 } from "./090-hallelujah-haptism.ts";

describe("Hallelujah Haptism (GD04-090)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04HallelujahHaptism090] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: expect.any(String),
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toHaveLength(1);
  });

  describe("【During Link】【Once per Turn】During your turn, when this Unit destroys an enemy Unit with battle damage, look at the top card of your deck. If it is a (CB) card, you may reveal it and add it to your hand. Return any remaining card to the bottom of your deck.", () => {
    it("adds the looked-at CB card to hand when the player chooses it", () => {
      const host = createMockUnit({
        name: "Hallelujah Host",
        ap: 4,
        hp: 5,
        level: 4,
        cost: 2,
        linkCondition: "[Hallelujah Haptism]",
      });
      const fragileEnemy = createMockUnit({ ap: 1, hp: 1 });
      const cbCard = createMockUnit({ name: "CB Reward", traits: ["cb"] });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04HallelujahHaptism090],
          play: [host],
          deck: [cbCard],
          resourceArea: activeResources(5),
        },
        { play: [{ card: fragileEnemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04HallelujahHaptism090, hostId));
      expectSuccess(p1.enterBattle(hostId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
      expect(choice.revealedCardIds).toHaveLength(1);
      expect(choice.legalTutorCardIds).toEqual(choice.revealedCardIds);
      const cbCardId = choice.revealedCardIds[0]!;
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { 0: { tutorCardId: cbCardId } },
        }),
      );

      expect(p1.getHand()).toContain(cbCardId);
      expect(p1.getCardsInZone("deck")).toHaveLength(0);
    });

    it("returns a non-CB card to the deck", () => {
      const host = createMockUnit({
        name: "Hallelujah Host",
        ap: 4,
        hp: 5,
        level: 4,
        cost: 2,
        linkCondition: "[Hallelujah Haptism]",
      });
      const fragileEnemy = createMockUnit({ ap: 1, hp: 1 });
      const nonCbCard = createMockUnit({ name: "Non-CB Card", traits: ["zaft"] });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04HallelujahHaptism090],
          play: [host],
          deck: [nonCbCard],
          resourceArea: activeResources(5),
        },
        { play: [{ card: fragileEnemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04HallelujahHaptism090, hostId));
      expectSuccess(p1.enterBattle(hostId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
      expect(choice.revealedCardIds).toHaveLength(1);
      expect(choice.legalTutorCardIds).toEqual([]);
      const nonCbCardId = choice.revealedCardIds[0]!;
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { 0: { toBottom: [nonCbCardId] } },
        }),
      );

      expect(p1.getHand()).toHaveLength(0);
      expect(p1.getCardsInZone("deck")).toHaveLength(1);
      expect(p1.getCardZone(nonCbCardId)).toBe(`deck:${PLAYER_ONE}`);
    });

    it("allows the player to return a CB card to the deck instead of adding it to hand", () => {
      const host = createMockUnit({
        name: "Hallelujah Host",
        ap: 4,
        hp: 5,
        level: 4,
        cost: 2,
        linkCondition: "[Hallelujah Haptism]",
      });
      const fragileEnemy = createMockUnit({ ap: 1, hp: 1 });
      const cbCard = createMockUnit({ name: "CB Reward", traits: ["cb"] });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04HallelujahHaptism090],
          play: [host],
          deck: [cbCard],
          resourceArea: activeResources(5),
        },
        { play: [{ card: fragileEnemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04HallelujahHaptism090, hostId));
      expectSuccess(p1.enterBattle(hostId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
      expect(choice.revealedCardIds).toHaveLength(1);
      expect(choice.legalTutorCardIds).toEqual(choice.revealedCardIds);
      const cbCardId = choice.revealedCardIds[0]!;
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { 0: { toBottom: [cbCardId] } },
        }),
      );

      expect(p1.getHand()).toHaveLength(0);
      expect(p1.getCardsInZone("deck")).toHaveLength(1);
      expect(p1.getCardZone(cbCardId)).toBe(`deck:${PLAYER_ONE}`);
    });

    it("still offers the CB reward when both battling Units destroy each other", () => {
      const host = createMockUnit({
        name: "Hallelujah Host",
        ap: 1,
        hp: 1,
        level: 4,
        cost: 2,
        linkCondition: "[Hallelujah Haptism]",
      });
      const fragileEnemy = createMockUnit({ ap: 2, hp: 1 });
      const cbCard = createMockUnit({ name: "CB Reward", traits: ["cb"] });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04HallelujahHaptism090],
          play: [host],
          deck: [cbCard],
          resourceArea: activeResources(5),
        },
        { play: [{ card: fragileEnemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04HallelujahHaptism090, hostId));
      expectSuccess(p1.enterBattle(hostId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
      expect(choice.legalTutorCardIds).toEqual(choice.revealedCardIds);
      const rewardId = choice.revealedCardIds[0]!;
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { 0: { tutorCardId: rewardId } },
        }),
      );

      expect(p1.getCardZone(hostId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getHand()).toContain(rewardId);
    });

    it("does not look at the deck when the paired Unit is not linked", () => {
      const host = createMockUnit({
        name: "Wrong Host",
        ap: 4,
        hp: 5,
        level: 4,
        cost: 2,
        linkCondition: "[Different Pilot]",
      });
      const fragileEnemy = createMockUnit({ ap: 1, hp: 1 });
      const cbCard = createMockUnit({ name: "CB Reward", traits: ["cb"] });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04HallelujahHaptism090],
          play: [host],
          deck: [cbCard],
          resourceArea: activeResources(5),
        },
        { play: [{ card: fragileEnemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04HallelujahHaptism090, hostId));
      expectSuccess(p1.enterBattle(hostId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getHand()).toHaveLength(0);
      expect(p1.getCardsInZone("deck")).toHaveLength(1);
    });
  });
});
