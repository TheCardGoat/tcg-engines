import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mamCocoVisitingThePark } from "./044-mama-coco-visiting-the-park";
import { aVeryMerryUnbirthday } from "../../006/actions/060-a-very-merry-unbirthday";
import { prestonWhitmoreExpeditionFinancier } from "../../012/characters/110-preston-whitmore-expedition-financier";

describe("Mamá Coco - Visiting the Park", () => {
  it("only boosts the affected deck owner for the real opposing mill song", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [mamCocoVisitingThePark], hand: [aVeryMerryUnbirthday], inkwell: 1, deck: 4 },
      { play: [mamCocoVisitingThePark], deck: 3 },
    );
    const ownCoco = engine.findCardInstanceId(mamCocoVisitingThePark, "play", PLAYER_ONE);
    const opposingCoco = engine.findCardInstanceId(mamCocoVisitingThePark, "play", PLAYER_TWO);
    expect(engine.asPlayerOne().playCard(aVeryMerryUnbirthday)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().resolvePendingByCard(opposingCoco)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCard(ownCoco).lore).toBe(1);
    expect(engine.asPlayerTwo().getCard(opposingCoco).lore).toBe(2);
    expect(engine.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(4);
    expect(engine.getCardInstanceIdsInZone("discard", PLAYER_ONE)).toHaveLength(1);
    expect(engine.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toHaveLength(1);
    expect(engine.getCardInstanceIdsInZone("discard", PLAYER_TWO)).toHaveLength(2);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCard(opposingCoco).lore).toBe(1);
    expect(engine.asPlayerTwo().quest(opposingCoco)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_TWO)).toBe(1);
  });

  it("gives player two one bonus for a one-card short-deck mill", () => {
    const mill = createMockAction({
      id: "coco-p2-short-mill",
      name: "Mill Two",
      cost: 0,
      text: "Mill two cards.",
      abilities: [{ type: "action", effect: { type: "mill", amount: 2, target: "CONTROLLER" } }],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6 },
      { play: [mamCocoVisitingThePark], hand: [mill], deck: 2 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(mill)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getZonesCardCount(PLAYER_TWO).deck).toBe(0);
    expect(engine.asPlayerTwo().getZonesCardCount(PLAYER_TWO).discard).toBe(2);
    expect(engine.asPlayerTwo().getCard(mamCocoVisitingThePark).lore).toBe(2);
    expect(engine.asPlayerTwo().quest(mamCocoVisitingThePark)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_TWO)).toBe(2);
    expect(engine.getLore(PLAYER_ONE)).toBe(0);
    const cocoId = engine.findCardInstanceId(mamCocoVisitingThePark, "play", PLAYER_TWO);
    expect(
      engine
        .asServer()
        .getMoveLogHistory()
        .flatMap((log) => log.public),
    ).toContainEqual({
      key: "lorcana.outcome.loreModifiedThisTurn",
      values: { sourceId: cocoId, targetId: cocoId, modifier: 1 },
    });
  });
  it("DISTANT MEMORY — gets +1 {L} this turn when cards are milled from your deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mamCocoVisitingThePark, prestonWhitmoreExpeditionFinancier],
      inkwell: mamCocoVisitingThePark.cost + prestonWhitmoreExpeditionFinancier.cost,
      deck: 4,
    });

    expect(testEngine.asPlayerOne().playCard(mamCocoVisitingThePark)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Preston's play trigger mills the top 2 cards of the controller's deck;
    // the mill and Coco's quest share this turn.
    expect(
      testEngine.asPlayerOne().playCard(prestonWhitmoreExpeditionFinancier),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(prestonWhitmoreExpeditionFinancier, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    // The mill happened: one batch of 2 cards moved deck → discard (the
    // turn's draw step took one deck card before the mill: 4 → 3 → 1).
    expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).deck).toBe(1);
    expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE).discard).toBe(2);

    // Questing the same turn: base 1 {L} + exactly +1 for the mill batch
    // (2 milled cards are "1 or more cards" — one trigger, not two).
    expect(testEngine.asPlayerOne().quest(mamCocoVisitingThePark)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
  });

  it("DISTANT MEMORY — the +1 {L} boost expires at the end of the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mamCocoVisitingThePark, prestonWhitmoreExpeditionFinancier],
      inkwell: mamCocoVisitingThePark.cost + prestonWhitmoreExpeditionFinancier.cost,
      deck: 4,
    });

    expect(testEngine.asPlayerOne().playCard(mamCocoVisitingThePark)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Mill on Coco's second turn, then quest on the same turn for the boost.
    expect(
      testEngine.asPlayerOne().playCard(prestonWhitmoreExpeditionFinancier),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(prestonWhitmoreExpeditionFinancier, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(mamCocoVisitingThePark)).toBeSuccessfulCommand();

    // Boost is "this turn" only: on the next turn Coco quests for base lore.
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(mamCocoVisitingThePark)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(3);
  });
  it("stacks separate mill batches but only once per batch", () => {
    const first = createMockAction({
      id: "coco-first-mill",
      name: "Mill One",
      cost: 0,
      text: "Put the top two cards of your deck into your discard.",
      abilities: [{ type: "action", effect: { type: "mill", amount: 2, target: "CONTROLLER" } }],
    });
    const second = createMockAction({
      id: "coco-second-mill",
      name: "Mill Two",
      cost: 0,
      text: "Mill two cards.",
      abilities: first.abilities,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: mamCocoVisitingThePark, isDrying: false }],
      hand: [first, second],
      deck: 6,
    });
    expect(engine.asPlayerOne().playCard(first)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCard(mamCocoVisitingThePark).lore).toBe(2);
    expect(engine.asPlayerOne().playCard(second)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(2);
    expect(engine.asPlayerOne().quest(mamCocoVisitingThePark)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(3);
  });

  it("does not trigger for the opponent's deck or an empty own deck", () => {
    const opponentMill = createMockAction({
      id: "coco-other-deck-mill",
      name: "Mill Opponent",
      cost: 0,
      text: "Mill two cards from the opponent's deck.",
      abilities: [{ type: "action", effect: { type: "mill", amount: 2, target: "OPPONENT" } }],
    });
    const emptyMill = createMockAction({
      id: "coco-empty-deck-mill",
      name: "Mill Empty Deck",
      cost: 0,
      text: "Mill two cards from your deck.",
      abilities: [{ type: "action", effect: { type: "mill", amount: 2, target: "CONTROLLER" } }],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: mamCocoVisitingThePark, isDrying: false }],
        hand: [opponentMill, emptyMill],
        deck: [],
      },
      { deck: 3 },
    );
    expect(engine.asPlayerOne().playCard(opponentMill)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getZonesCardCount(PLAYER_TWO).discard).toBe(2);
    expect(engine.asPlayerOne().playCard(emptyMill)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().quest(mamCocoVisitingThePark)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("triggers for its own deck during the opponent's turn and expires at turn end", () => {
    const mill = createMockAction({
      id: "coco-opposing-turn-mill",
      name: "Mill Opponent",
      cost: 0,
      text: "Mill two cards from the opponent's deck.",
      abilities: [{ type: "action", effect: { type: "mill", amount: 2, target: "OPPONENT" } }],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [mamCocoVisitingThePark], deck: 5 },
      { hand: [mill], deck: 3 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(mill)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(mamCocoVisitingThePark),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCard(mamCocoVisitingThePark).lore).toBe(2);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().quest(mamCocoVisitingThePark)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("does not trigger for a card discarded from hand", () => {
    const discard = createMockAction({
      id: "coco-hand-discard",
      name: "Discard",
      cost: 0,
      text: "Discard a card.",
      abilities: [{ type: "action", effect: { type: "discard", amount: 1, target: "CONTROLLER" } }],
    });
    const filler = createMockCharacter({ id: "coco-hand-filler", name: "Filler", cost: 1 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: mamCocoVisitingThePark, isDrying: false }],
      hand: [discard, filler],
      deck: [],
    });
    expect(engine.asPlayerOne().playCard(discard)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(discard, { targets: [filler] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(filler)).toBe("discard");
    expect(engine.asPlayerOne().quest(mamCocoVisitingThePark)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(1);
  });
});
