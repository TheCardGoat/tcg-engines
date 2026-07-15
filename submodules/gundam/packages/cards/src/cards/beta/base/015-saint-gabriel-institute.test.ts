import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  activeResources,
  createMockUnit,
} from "@tcg/gundam-engine";
import { betaSaintGabrielInstitute015 } from "./015-saint-gabriel-institute.ts";
describe("Saint Gabriel Institute (ST02-015)", () => {
  it("【Burst】Deploy this card — flips Saint Gabriel into baseSection on shield destruction", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [betaSaintGabrielInstitute015] },
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

  it("【Deploy】 moves 1 Shield to hand and triggers the lookAtTopDeck rider", () => {
    const shield = createMockUnit({ name: "Shield Card" });
    const first = createMockUnit({ name: "First Revealed" });
    const second = createMockUnit({ name: "Second Revealed" });
    const filler = createMockUnit({ name: "Unrevealed Filler" });
    const engine = GundamTestEngine.create({
      hand: [betaSaintGabrielInstitute015],
      resourceArea: activeResources(2),
      shieldArea: [shield],
      deck: [first, second, filler],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const baseId = p1.getHand()[0]!;
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.deployBase(baseId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "deckLook",
      sourceCardId: baseId,
      directiveIndex: 1,
    });
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
    const [firstRevealedId, secondRevealedId] = choice.revealedCardIds;
    if (!firstRevealedId || !secondRevealedId) throw new Error("Expected two revealed cards");
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: {
          1: { toTop: [firstRevealedId], toBottom: [secondRevealedId] },
        },
      }),
    );

    expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getCardZone(shieldId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("deck").at(-1)).toBe(firstRevealedId);
    expect(p1.getCardsInZone("deck")[0]).toBe(secondRevealedId);
  });
});
