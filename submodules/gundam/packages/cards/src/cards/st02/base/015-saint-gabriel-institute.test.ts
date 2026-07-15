import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  activeResources,
  createMockUnit,
} from "@tcg/gundam-engine";
import { st02SaintGabrielInstitute015 } from "./015-saint-gabriel-institute.ts";

describe("Saint Gabriel Institute (ST02-015)", () => {
  it("【Deploy】 adds 1 shield to hand (and orders top 2 deck cards)", () => {
    const firstShield = createMockUnit({ name: "First Shield" });
    const secondShield = createMockUnit({ name: "Second Shield" });
    const first = createMockUnit({ name: "First Revealed" });
    const second = createMockUnit({ name: "Second Revealed" });
    const filler = createMockUnit({ name: "Unrevealed Filler" });
    const baseDestroyer = createMockUnit({ name: "Base Destroyer", ap: 5, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [st02SaintGabrielInstitute015, st02SaintGabrielInstitute015],
        resourceArea: activeResources(4),
        shieldArea: [firstShield, secondShield],
        deck: [first, second, filler],
      },
      { play: [baseDestroyer], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [baseId, secondBaseId] = p1.getHand();
    const [firstShieldId, secondShieldId] = p1.getCardsInZone("shieldArea");

    expectSuccess(p1.deployBase(baseId!));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "deckLook",
      sourceCardId: baseId,
      directiveIndex: 1,
    });
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
    const [firstRevealedId, secondRevealedId] = choice.revealedCardIds;
    if (!firstRevealedId || !secondRevealedId) {
      throw new Error("Expected two revealed cards");
    }
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: {
          1: { toTop: [secondRevealedId], toBottom: [firstRevealedId] },
        },
      }),
    );

    expect(p1.getCardZone(firstShieldId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(baseId!)).toBe(`baseSection:${PLAYER_ONE}`);

    const baseDestroyerId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.enterBattle(baseDestroyerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getCardZone(baseId!)).toBe(`trash:${PLAYER_ONE}`);
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());

    expect(p1.getCardZone(secondRevealedId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(firstRevealedId)).toBe(`deck:${PLAYER_ONE}`);

    expectSuccess(p1.deployBase(secondBaseId!));
    const secondChoice = p1.getBoardView().pendingChoice;
    if (secondChoice?.kind !== "deckLook") throw new Error("Expected a second deck-look choice");

    expect(secondChoice.revealedCardIds.at(-1)).toBe(firstRevealedId);

    const [nextTopId, nextBottomId] = secondChoice.revealedCardIds;
    if (!nextTopId || !nextBottomId) throw new Error("Expected two cards in the second look");
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: {
          1: { toTop: [nextTopId], toBottom: [nextBottomId] },
        },
      }),
    );

    expect(p1.getCardZone(secondShieldId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(secondBaseId!)).toBe(`baseSection:${PLAYER_ONE}`);
  });

  it("【Burst】 Deploy this card — flips the base into baseSection on shield destruction", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [st02SaintGabrielInstitute015] },
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

    expect(p2.getCardZone(shieldId)).toBe(`baseSection:${PLAYER_TWO}`);
  });
});
