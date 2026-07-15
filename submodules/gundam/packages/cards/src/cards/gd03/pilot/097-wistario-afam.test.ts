import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03WistarioAfam097 } from "./097-wistario-afam.ts";

describe("Wistario Afam (GD03-097)", () => {
  it("【Burst】 adds this card to hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03WistarioAfam097] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03WistarioAfam097)).toBe(`hand:${PLAYER_TWO}`);
  });

  describe("【During Link】【Once per Turn】During your turn, when this Unit destroys an enemy Unit with battle damage, look at the top 2 cards of your deck and return 1 to the top. Place the remaining card into your trash.", () => {
    it("keeps one of the top 2 cards in deck and places the remaining card into trash", () => {
      const host = createMockUnit({
        name: "Wistario Host",
        ap: 4,
        hp: 5,
        level: 4,
        cost: 2,
        linkCondition: "[Wistario Afam]",
      });
      const fragileEnemy = createMockUnit({ ap: 1, hp: 1 });
      const kept = createMockUnit({ name: "Kept Top" });
      const trashed = createMockUnit({ name: "Trashed Remaining" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03WistarioAfam097],
          play: [host],
          deck: [kept, trashed],
          resourceArea: activeResources(5),
        },
        { play: [{ card: fragileEnemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilotId, hostId));

      expectSuccess(p1.enterBattle(hostId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "deckLook",
        sourceCardId: pilotId,
        directiveIndex: 0,
      });
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
      const [keptId, trashedId] = choice.revealedCardIds;
      if (!keptId || !trashedId) throw new Error("Expected two revealed cards");
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { 0: { toTop: [keptId], toTrash: [trashedId] } },
        }),
      );

      expect(p1.getCardZone(keptId)).toBe(`deck:${PLAYER_ONE}`);
      expect(p1.getCardZone(trashedId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
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
      const top1 = createMockUnit({ name: "Top 1" });
      const top2 = createMockUnit({ name: "Top 2" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03WistarioAfam097],
          play: [host],
          deck: [top1, top2],
          resourceArea: activeResources(5),
        },
        { play: [{ card: fragileEnemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;
      const deckBefore = p1.getCardsInZone("deck").length;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilotId, hostId));

      expectSuccess(p1.enterBattle(hostId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore);
    });

    it("does not look at the deck after its linked Unit destroys an attacker on the opponent's turn", () => {
      const host = createMockUnit({
        ap: 4,
        hp: 5,
        level: 4,
        cost: 2,
        linkCondition: "[Wistario Afam]",
      });
      const fragileAttacker = createMockUnit({ ap: 1, hp: 1 });
      const transitionDefender = createMockUnit({ ap: 0, hp: 10 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03WistarioAfam097],
          play: [host],
          deck: 3,
          resourceArea: activeResources(5),
        },
        {
          play: [fragileAttacker, { card: transitionDefender, exhausted: true }],
          deck: 5,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const [attackerId, transitionDefenderId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd03WistarioAfam097, hostId));
      expectSuccess(p1.enterBattle(hostId, transitionDefenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

      expectSuccess(p2.enterBattle(attackerId!, hostId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      expect(p2.getCardZone(attackerId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore);
    });
  });
});
