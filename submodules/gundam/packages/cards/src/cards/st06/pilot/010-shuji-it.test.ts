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
import { st06ShujiIt010 } from "./010-shuji-it.ts";

function revealShujiBurst(): {
  p2: ReturnType<GundamTestEngine["asPlayer"]>;
  sourceCardId: string;
  directiveIndex: number;
} {
  const engine = GundamTestEngine.create(
    { play: [createMockUnit({ ap: 1, hp: 4 })] },
    { shieldArea: [st06ShujiIt010] },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());
  const choice = p2.getBoardView().pendingChoice;
  if (choice?.kind !== "optional") throw new Error("Expected Shuji's visible Burst choice");
  return { p2, sourceCardId: choice.sourceCardId, directiveIndex: choice.directiveIndex };
}

describe("Shuji Itō (ST06-010)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds the revealed physical card to its controller's hand when accepted", () => {
      const { p2, sourceCardId, directiveIndex } = revealShujiBurst();
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [directiveIndex]: true } }));
      expect(p2.getCardZone(sourceCardId)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("moves the revealed physical card to its controller's trash when declined", () => {
      const { p2, sourceCardId, directiveIndex } = revealShujiBurst();
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [directiveIndex]: false } }));
      expect(p2.getCardZone(sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
    });
  });

  describe("Lv.4 cost 1 Pilot with AP+1/HP+2", () => {
    it("pairs the exact card and visibly applies its printed bonuses", () => {
      const engine = GundamTestEngine.create({
        hand: [st06ShujiIt010],
        play: [createMockUnit({ ap: 2, hp: 3 })],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(pilotId, hostId));

      expect(p1.getPilotId(hostId)).toBe(pilotId);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 5 });
    });

    it("cannot pair below Lv.4 or without one active Resource", () => {
      const lowLevel = GundamTestEngine.create({
        hand: [st06ShujiIt010],
        play: [createMockUnit()],
        resourceArea: activeResources(3),
      }).asPlayer(PLAYER_ONE);
      expectFailure(
        lowLevel.assignPilot(st06ShujiIt010, lowLevel.getCardsInZone("battleArea")[0]!),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );

      const noPayment = GundamTestEngine.create({
        hand: [st06ShujiIt010],
        play: [createMockUnit()],
        resourceArea: restedResources(4),
      }).asPlayer(PLAYER_ONE);
      expectFailure(
        noPayment.assignPilot(st06ShujiIt010, noPayment.getCardsInZone("battleArea")[0]!),
        "INSUFFICIENT_RESOURCES",
      );
    });
  });

  describe("【During Link】【Attack】Clan Unit top-card routing", () => {
    it("on attack while linked with a Clan Unit in play, offers the visible top card", () => {
      const host = createMockUnit({ linkCondition: "[Shuji Itō]" });
      const clan = createMockUnit({ traits: ["clan"] });
      const engine = GundamTestEngine.create(
        {
          hand: [st06ShujiIt010],
          play: [host, clan],
          resourceArea: activeResources(4),
          deck: [createMockUnit({ name: "Top Card" })],
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(pilotId, hostId));
      expectSuccess(p1.enterBattle(hostId, "direct"));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected Shuji's attack deck look");
      expect(choice).toMatchObject({
        sourceCardId: pilotId,
        revealedCardIds: expect.any(Array),
        legalTutorCardIds: [],
        randomizeRemainingToBottom: false,
      });
      expect(choice.revealedCardIds).toHaveLength(1);
    });

    it("lets its controller return the revealed card to the top", () => {
      const host = createMockUnit({ linkCondition: "[Shuji Itō]" });
      const clan = createMockUnit({ traits: ["clan"] });
      const engine = GundamTestEngine.create(
        {
          hand: [st06ShujiIt010],
          play: [host, clan],
          resourceArea: activeResources(4),
          deck: [createMockUnit({ name: "Sentinel" }), createMockUnit({ name: "Top" })],
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(st06ShujiIt010, hostId));
      expectSuccess(p1.enterBattle(hostId, "direct"));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected Shuji's attack deck look");
      const revealedId = choice.revealedCardIds[0]!;

      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { [choice.directiveIndex]: { toTop: [revealedId] } },
        }),
      );

      expect(p1.getCardZone(revealedId)).toBe(`deck:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("lets its controller return the revealed card to the bottom", () => {
      const host = createMockUnit({ linkCondition: "[Shuji Itō]" });
      const engine = GundamTestEngine.create(
        {
          hand: [st06ShujiIt010],
          play: [host, createMockUnit({ traits: ["clan"] })],
          resourceArea: activeResources(4),
          deck: [createMockUnit({ name: "Sentinel" }), createMockUnit({ name: "Top" })],
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(st06ShujiIt010, hostId));
      expectSuccess(p1.enterBattle(hostId, "direct"));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected Shuji's attack deck look");
      const revealedId = choice.revealedCardIds[0]!;

      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { [choice.directiveIndex]: { toBottom: [revealedId] } },
        }),
      );

      expect(p1.getCardZone(revealedId)).toBe(`deck:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("does not trigger when paired but not linked", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st06ShujiIt010],
          play: [createMockUnit({ traits: ["clan"] })],
          resourceArea: activeResources(4),
          deck: [createMockUnit()],
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(st06ShujiIt010, hostId));
      expectSuccess(p1.enterBattle(hostId, "direct"));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
    });

    it("does not count the Clan Pilot itself as a Clan Unit in play", () => {
      const host = createMockUnit({ traits: ["zeon"], linkCondition: "[Shuji Itō]" });
      const engine = GundamTestEngine.create(
        {
          hand: [st06ShujiIt010],
          play: [host],
          resourceArea: activeResources(4),
          deck: [createMockUnit()],
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(st06ShujiIt010, hostId));
      expectSuccess(p1.enterBattle(hostId, "direct"));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
    });

    it("cleanly completes when the deck is empty", () => {
      const host = createMockUnit({ traits: ["clan"], linkCondition: "[Shuji Itō]" });
      const engine = GundamTestEngine.create(
        { hand: [st06ShujiIt010], play: [host], resourceArea: activeResources(4) },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(st06ShujiIt010, hostId));
      expectSuccess(p1.enterBattle(hostId, "direct"));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });
  });
});
