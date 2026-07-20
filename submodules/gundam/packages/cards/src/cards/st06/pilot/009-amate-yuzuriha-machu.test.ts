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
  restedResources,
} from "@tcg/gundam-engine";
import { st06AmateYuzurihaMachu009 } from "./009-amate-yuzuriha-machu.ts";

function revealMachuBurst(): {
  p2: ReturnType<GundamTestEngine["asPlayer"]>;
  sourceCardId: string;
  directiveIndex: number;
} {
  const attacker = createMockUnit({ ap: 1, hp: 4 });
  const engine = GundamTestEngine.create(
    { play: [attacker] },
    { shieldArea: [st06AmateYuzurihaMachu009] },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);

  expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());
  const choice = p2.getBoardView().pendingChoice;
  if (choice?.kind !== "optional") throw new Error("Expected Machu's visible Burst choice");
  return { p2, sourceCardId: choice.sourceCardId, directiveIndex: choice.directiveIndex };
}

describe("Amate Yuzuriha (Machu) (ST06-009)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds the revealed physical card to its controller's hand when accepted", () => {
      const { p2, sourceCardId, directiveIndex } = revealMachuBurst();

      expectSuccess(p2.resolveEffect({ optionalAnswers: { [directiveIndex]: true } }));

      expect(p2.getCardZone(sourceCardId)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("moves the revealed physical card to its controller's trash when declined", () => {
      const { p2, sourceCardId, directiveIndex } = revealMachuBurst();

      expectSuccess(p2.resolveEffect({ optionalAnswers: { [directiveIndex]: false } }));

      expect(p2.getCardZone(sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
    });
  });

  describe("Lv.4 cost 1 Pilot with AP+2/HP+1", () => {
    it("pairs the exact physical card and applies its printed bonuses", () => {
      const host = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [st06AmateYuzurihaMachu009],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(pilotId, hostId));

      expect(p1.getPilotId(hostId)).toBe(pilotId);
      expect(p1.getCardZone(pilotId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 4, effectiveHp: 4 });
    });

    it("cannot pair below Lv.4 or without one active Resource", () => {
      const host = createMockUnit();
      const lowLevel = GundamTestEngine.create({
        hand: [st06AmateYuzurihaMachu009],
        play: [host],
        resourceArea: activeResources(3),
      }).asPlayer(PLAYER_ONE);
      expectFailure(
        lowLevel.assignPilot(st06AmateYuzurihaMachu009, lowLevel.getCardsInZone("battleArea")[0]!),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );

      const noPayment = GundamTestEngine.create({
        hand: [st06AmateYuzurihaMachu009],
        play: [host],
        resourceArea: restedResources(4),
      }).asPlayer(PLAYER_ONE);
      expectFailure(
        noPayment.assignPilot(
          st06AmateYuzurihaMachu009,
          noPayment.getCardsInZone("battleArea")[0]!,
        ),
        "INSUFFICIENT_RESOURCES",
      );
    });
  });

  describe("【When Linked】Clan top-card tutor", () => {
    it("reveals one card, offers Clan Units and Pilots, and adds only the chosen card", () => {
      const host = createMockUnit({ linkCondition: "[Amate Yuzuriha]" });
      const clanUnit = createMockUnit({ traits: ["clan"] });
      const clanPilot = createMockPilot({ traits: ["clan"] });
      const engine = GundamTestEngine.create({
        hand: [st06AmateYuzurihaMachu009],
        play: [host],
        resourceArea: activeResources(4),
        deck: [clanUnit, clanPilot],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(pilotId, hostId));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected Machu's deck-look choice");
      expect(choice).toMatchObject({ sourceCardId: pilotId, randomizeRemainingToBottom: false });
      expect(choice.revealedCardIds).toHaveLength(1);
      expect(choice.legalTutorCardIds).toEqual(choice.revealedCardIds);
      const chosenId = choice.legalTutorCardIds[0]!;
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { [choice.directiveIndex]: { tutorCardId: chosenId } },
        }),
      );

      expect(p1.getCardZone(chosenId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
    });

    it("offers no tutor for a non-Clan card and returns it to the deck", () => {
      const host = createMockUnit({ linkCondition: "[Amate Yuzuriha]" });
      const engine = GundamTestEngine.create({
        hand: [st06AmateYuzurihaMachu009],
        play: [host],
        resourceArea: activeResources(4),
        deck: [createMockUnit({ traits: ["zeon"] })],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.assignPilot(st06AmateYuzurihaMachu009, p1.getCardsInZone("battleArea")[0]!));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected Machu's deck-look choice");
      expect(choice.legalTutorCardIds).toEqual([]);
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            [choice.directiveIndex]: { toBottom: choice.revealedCardIds },
          },
        }),
      );

      expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
    });

    it("may decline an eligible Clan card and returns it to the deck", () => {
      const host = createMockUnit({ linkCondition: "[Amate Yuzuriha]" });
      const engine = GundamTestEngine.create({
        hand: [st06AmateYuzurihaMachu009],
        play: [host],
        resourceArea: activeResources(4),
        deck: [createMockPilot({ traits: ["clan"] })],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.assignPilot(st06AmateYuzurihaMachu009, p1.getCardsInZone("battleArea")[0]!));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected Machu's deck-look choice");
      expect(choice.legalTutorCardIds).toHaveLength(1);
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            [choice.directiveIndex]: { toBottom: choice.revealedCardIds },
          },
        }),
      );

      expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
    });

    it("does not trigger when paired without satisfying the Unit's Link condition", () => {
      const engine = GundamTestEngine.create({
        hand: [st06AmateYuzurihaMachu009],
        play: [createMockUnit()],
        resourceArea: activeResources(4),
        deck: [createMockUnit({ traits: ["clan"] })],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.assignPilot(st06AmateYuzurihaMachu009, p1.getCardsInZone("battleArea")[0]!));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
    });

    it("cleanly completes when linked with an empty deck", () => {
      const engine = GundamTestEngine.create({
        hand: [st06AmateYuzurihaMachu009],
        play: [createMockUnit({ linkCondition: "[Amate Yuzuriha]" })],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.assignPilot(st06AmateYuzurihaMachu009, p1.getCardsInZone("battleArea")[0]!));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });
  });
});
