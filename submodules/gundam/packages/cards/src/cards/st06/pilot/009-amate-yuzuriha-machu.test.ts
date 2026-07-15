import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st06AmateYuzurihaMachu009 } from "./009-amate-yuzuriha-machu.ts";

describe("Amate Yuzuriha (Machu) (ST06-009)", () => {
  it("【Burst】 Add this card to your hand — moves shield into hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [st06AmateYuzurihaMachu009] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(shieldId)).toBe(`hand:${PLAYER_TWO}`);
  });

  describe("【When Linked】 top-deck reveal / Clan tutor", () => {
    it("reveals top Clan card and moves it to hand on a link pairing", () => {
      const hostUnit = createMockUnit({
        level: 5,
        cost: 1,
        linkCondition: "[Amate Yuzuriha]",
      });
      const clanCardOnTop = createMockUnit({
        level: 3,
        cost: 2,
        traits: ["clan"],
      });
      const engine = GundamTestEngine.create(
        {
          hand: [hostUnit, st06AmateYuzurihaMachu009],
          resourceArea: activeResources(6),
          deck: [clanCardOnTop],
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getHand()[0]!;
      const pilotId = p1.getHand()[1]!;
      expectSuccess(p1.deployUnit(hostUnit));
      expectSuccess(p1.assignPilot(pilotId, hostId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "deckLook",
        sourceCardId: pilotId,
        directiveIndex: 0,
      });
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
      const clanCardId = choice.legalTutorCardIds[0];
      if (!clanCardId) throw new Error("Expected the revealed Clan card to be eligible");
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { 0: { tutorCardId: clanCardId, toBottom: [] } },
        }),
      );

      expect(p1.getCardZone(clanCardId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("deck")).toHaveLength(0);
    });

    it("non-link pairing (no unit linkCondition) does NOT fire whenLinked — Clan card stays in deck", () => {
      const hostUnit = createMockUnit({ level: 5, cost: 1 }); // no linkCondition
      const clanCardOnTop = createMockUnit({
        level: 3,
        cost: 2,
        traits: ["clan"],
      });
      const filler = createMockUnit({ level: 1, cost: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [hostUnit, st06AmateYuzurihaMachu009],
          resourceArea: activeResources(6),
          deck: [clanCardOnTop, filler],
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const deckBefore = p1.getCardsInZone("deck");
      const hostId = p1.getHand()[0]!;
      const pilotId = p1.getHand()[1]!;
      expectSuccess(p1.deployUnit(hostUnit));
      expectSuccess(p1.assignPilot(pilotId, hostId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardsInZone("deck")).toEqual(deckBefore);
    });
  });
});
