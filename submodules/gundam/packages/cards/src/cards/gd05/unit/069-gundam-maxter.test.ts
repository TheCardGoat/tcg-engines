import { describe, expect, it } from "vite-plus/test";
import type { Card } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05CyclonePunch121 } from "../command/121-cyclone-punch.ts";
import { gd05GundamMaxter069 } from "./069-gundam-maxter.ts";

function finishBattle(
  p1: ReturnType<GundamTestEngine["asPlayer"]>,
  p2: ReturnType<GundamTestEngine["asPlayer"]>,
) {
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());
}

function pairedMainCommand(pilotName: string) {
  return createMockCommand({
    name: `${pilotName} Special Move`,
    pilotName,
    level: 1,
    cost: 1,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [{ action: { action: "draw", count: 1 } }],
        sourceText: "【Main】Draw 1.",
      },
    ],
  });
}

function destroyEnemyWithTopDeck(deck: Card[]) {
  const defender = createMockUnit({ name: "Defender", ap: 0, hp: 2 });
  const engine = GundamTestEngine.create(
    { play: [gd05GundamMaxter069], deck },
    { play: [{ card: defender, exhausted: true }], deck: 5 },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const maxterId = p1.getCardsInZone("battleArea")[0]!;
  const defenderId = p2.getCardsInZone("battleArea")[0]!;

  expectSuccess(p1.enterBattle(maxterId, defenderId));
  finishBattle(p1, p2);

  return { p1, p2, maxterId, defenderId };
}

describe("Gundam Maxter (GD05-069)", () => {
  /** @behavioral-proof complete: both clauses, tutor filtering/choice, source gate, Link, and Attack timing are public. */
  describe("During your turn, when this Unit destroys an enemy Unit with battle damage, look at the top 4 cards of your deck.", () => {
    it("reveals the top four and offers only a Special Move Command", () => {
      const specialMove = createMockCommand({
        name: "Eligible Special Move",
        traits: ["special move"],
      });
      const ordinaryCommand = createMockCommand({
        name: "Ordinary Command",
        traits: ["academy"],
      });
      const { p1, defenderId } = destroyEnemyWithTopDeck([
        specialMove,
        ordinaryCommand,
        createMockUnit(),
        createMockPilot(),
      ]);

      expect(p1.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected Maxter's deck-look choice");
      expect(choice).toMatchObject({
        randomizeRemainingToBottom: true,
      });
      expect(choice.revealedCardIds).toHaveLength(4);
      expect(choice.legalTutorCardIds).toHaveLength(1);

      const chosenId = choice.legalTutorCardIds[0]!;
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { [choice.directiveIndex]: { tutorCardId: chosenId } },
        }),
      );

      expect(p1.getCardZone(chosenId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
    });

    it("does not offer a Special Move Unit or a Command with another trait", () => {
      const { p1 } = destroyEnemyWithTopDeck([
        createMockUnit({ traits: ["special move"] }),
        createMockCommand({ traits: ["shuffle alliance"] }),
        createMockPilot({ traits: ["special move"] }),
        createMockUnit(),
      ]);

      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected Maxter's deck-look choice");
      expect(choice.legalTutorCardIds).toEqual([]);
      expectSuccess(p1.resolveEffect({ deckLookAnswers: { [choice.directiveIndex]: {} } }));

      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(4);
    });

    it("may decline an eligible Special Move and returns all four cards to the deck", () => {
      const { p1 } = destroyEnemyWithTopDeck([
        createMockCommand({ traits: ["special move"] }),
        createMockUnit(),
        createMockPilot(),
        createMockCommand(),
      ]);

      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected Maxter's deck-look choice");
      expect(choice.legalTutorCardIds).toHaveLength(1);
      expectSuccess(p1.resolveEffect({ deckLookAnswers: { [choice.directiveIndex]: {} } }));

      expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(4);
    });

    it("does not trigger when another friendly Unit destroys the enemy in battle", () => {
      const otherAttacker = createMockUnit({ name: "Other Attacker", ap: 3 });
      const defender = createMockUnit({ name: "Defender", ap: 0, hp: 2 });
      const engine = GundamTestEngine.create(
        {
          play: [gd05GundamMaxter069, otherAttacker],
          deck: [
            createMockCommand({ traits: ["special move"] }),
            createMockUnit(),
            createMockPilot(),
            createMockCommand(),
          ],
        },
        { play: [{ card: defender, exhausted: true }], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [, otherId] = p1.getCardsInZone("battleArea");
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(otherId!, defenderId));
      finishBattle(p1, p2);

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(4);
    });
  });

  describe("【During Link】【Attack】Activate 【Main】 on the card paired with this Unit.", () => {
    it("activates the paired Chibodee Crocket card's Main effect when Maxter attacks", () => {
      const specialMove = pairedMainCommand("Chibodee Crocket");
      const engine = GundamTestEngine.create({
        hand: [specialMove],
        play: [gd05GundamMaxter069],
        resourceArea: activeResources(3),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const maxterId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommandAsPilot(specialMove, maxterId));
      const handBeforeAttack = p1.getHand().length;
      expectSuccess(p1.enterBattle(maxterId, "direct"));

      expect(p1.getHand()).toHaveLength(handBeforeAttack + 1);
    });

    it("does not activate the paired Main before Maxter attacks", () => {
      const specialMove = pairedMainCommand("Chibodee Crocket");
      const engine = GundamTestEngine.create({
        hand: [specialMove],
        play: [gd05GundamMaxter069],
        resourceArea: activeResources(3),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const maxterId = p1.getCardsInZone("battleArea")[0]!;
      const handBeforePairing = p1.getHand().length;

      expectSuccess(p1.playCommandAsPilot(specialMove, maxterId));

      expect(p1.getHand()).toHaveLength(handBeforePairing - 1);
    });

    it("does not activate Main when the paired card does not satisfy Link", () => {
      const wrongPilot = pairedMainCommand("Wrong Pilot");
      const engine = GundamTestEngine.create({
        hand: [wrongPilot],
        play: [gd05GundamMaxter069],
        resourceArea: activeResources(3),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const maxterId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommandAsPilot(wrongPilot, maxterId));
      const handBeforeAttack = p1.getHand().length;
      expectSuccess(p1.enterBattle(maxterId, "direct"));

      expect(p1.getHand()).toHaveLength(handBeforeAttack);
    });

    it("resolves Cyclone Punch's Main but does not activate its trash-only Pair clause", () => {
      const enemy = createMockUnit({ name: "Enemy", ap: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05CyclonePunch121],
          play: [gd05GundamMaxter069],
          resourceArea: activeResources(3),
          deck: 5,
        },
        { play: [enemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const maxterId = p1.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommandAsPilot(commandId, maxterId));
      expectSuccess(p1.enterBattle(maxterId, "direct"));
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(3);
      expect(p1.getPilotId(maxterId)).toBe(commandId);
      expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
    });
  });
});
