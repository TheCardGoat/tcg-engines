import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { minnieMouseUrbanVisionary } from "./155-minnie-mouse-urban-visionary";
import { dragonFire } from "../../001/actions/130-dragon-fire";

const inkCard = createMockCharacter({ id: "minnie-ink", name: "Ink Card", cost: 2 });

describe("Minnie Mouse - Urban Visionary", () => {
  it("Player Two copies keep separate optional decisions and reject invalid returns atomically", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { inkwell: [inkCard], deck: 3 },
      {
        play: [
          { card: minnieMouseUrbanVisionary, isDrying: false },
          { card: minnieMouseUrbanVisionary, isDrying: false },
        ],
        inkwell: [inkCard, inkCard, inkCard],
        deck: 3,
      },
    );
    const [first, second] = g.getCardInstanceIdsInZone("play", PLAYER_TWO);
    const ownInk = g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(first!)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(second!)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().resolvePendingByCard(first!)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().resolveNextPending({ resolveOptional: false })).toBeSuccessfulCommand();
    expect(g.getAuthoritativeState().ctx.zones.reveals.active).toHaveLength(0);
    const privateBoard = g.getBoard("playerTwo");
    expect(
      privateBoard.players[PLAYER_TWO]!.inkwell.every((id) => privateBoard.cards[id]!.hidden),
    ).toBe(true);
    expect(g.asPlayerTwo().resolveNextPending({ resolveOptional: false })).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(3);
    expect(g.asPlayerTwo().resolvePendingByCard(second!)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().resolveNextPending({ resolveOptional: false })).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({ resolveOptional: true, targets: [ownInk[1]!] }),
    ).not.toBeSuccessfulCommand();
    for (const targets of [
      [ownInk[0]!, ownInk[1]!],
      [ownInk[1]!, ownInk[1]!],
    ]) {
      expect(
        g.asPlayerTwo().resolveNextPending({ resolveOptional: true, targets }),
      ).not.toBeSuccessfulCommand();
      expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toEqual(ownInk);
      expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(3);
    }
    expect(
      g.asPlayerTwo().resolveNextPending({ resolveOptional: true, targets: [ownInk[1]!] }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_TWO)).toContain(ownInk[1]!);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toEqual([ownInk[0]!, ownInk[2]!]);
    expect(g.asPlayerTwo().isExerted(ownInk[0]!)).toBe(true);
    expect(g.asPlayerTwo().isExerted(ownInk[2]!)).toBe(true);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(g.getLore(PLAYER_TWO)).toBe(6);
  });

  it("unpaid play and normal inking create no end-turn ability", () => {
    const unpaid = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [minnieMouseUrbanVisionary],
      inkwell: 7,
    });
    expect(unpaid.asPlayerOne().playCard(minnieMouseUrbanVisionary)).not.toBeSuccessfulCommand();
    expect(unpaid.asPlayerOne().getCardZone(minnieMouseUrbanVisionary)).toBe("hand");
    expect(unpaid.asServer().getAvailableInk(PLAYER_ONE)).toBe(7);
    expect(unpaid.asPlayerOne().getBagCount()).toBe(0);
    const ink = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [minnieMouseUrbanVisionary],
      deck: 3,
    });
    expect(
      ink.asPlayerOne().putIntoInkwell(PLAYER_ONE, minnieMouseUrbanVisionary),
    ).toBeSuccessfulCommand();
    expect(ink.asPlayerOne().getCardZone(minnieMouseUrbanVisionary)).toBe("inkwell");
    expect(ink.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(ink.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(ink.asPlayerOne().getBagCount()).toBe(0);
    expect(ink.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("a return choice rejects opposing ink and nonink zones then returns exact own ink", () => {
    const handCard = createMockCharacter({ id: "minnie-hand-only", name: "Hand Only", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: minnieMouseUrbanVisionary, exerted: true, isDrying: false }],
        hand: [handCard],
        inkwell: [inkCard, inkCard],
        deck: 3,
      },
      { inkwell: [inkCard], deck: 3 },
    );
    const ownInk = g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE);
    const opposingInk = g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolvePendingByCard(minnieMouseUrbanVisionary)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolveNextPending({ resolveOptional: false })).toBeSuccessfulCommand();
    for (const target of [opposingInk[0]!, handCard, minnieMouseUrbanVisionary]) {
      expect(
        g.asPlayerOne().resolveNextPending({ resolveOptional: true, targets: [target] }),
      ).not.toBeSuccessfulCommand();
      expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toEqual(ownInk);
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    }
    expect(
      g.asPlayerOne().resolveNextPending({ resolveOptional: true, targets: [ownInk[1]!] }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toContain(ownInk[1]!);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toEqual([ownInk[0]!]);
    expect(g.isExerted(ownInk[0]!)).toBe(true);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toEqual(opposingInk);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(1);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("an empty inkwell ends the ability without returning a card or leaving a prompt", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: minnieMouseUrbanVisionary, isDrying: false, exerted: true }], deck: 3 },
      { deck: 3 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolvePendingByCard(minnieMouseUrbanVisionary)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolveNextPending({ resolveOptional: true })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolveNextPending({ resolveOptional: true })).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("player two returns only their own chosen ink and exerts only their remaining ink", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { inkwell: [inkCard], deck: 3 },
      {
        play: [{ card: minnieMouseUrbanVisionary, isDrying: false }],
        inkwell: [inkCard, inkCard],
        deck: 3,
      },
    );
    const ownInk = g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE);
    const [chosenId, remainingId] = g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(minnieMouseUrbanVisionary)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().resolvePendingByCard(minnieMouseUrbanVisionary)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().resolveNextPending({ resolveOptional: true })).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolveNextPending({ resolveOptional: true, targets: [chosenId!] }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_TWO)).toContain(chosenId!);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toEqual([remainingId!]);
    expect(g.asPlayerTwo().isExerted(remainingId!)).toBe(true);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toEqual(ownInk);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.getLore(PLAYER_TWO)).toBe(3);
  });

  it("Ward rejects opposing Dragon Fire without payment but allows friendly Dragon Fire", () => {
    const opposing = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [dragonFire], inkwell: 5 },
      { play: [minnieMouseUrbanVisionary] },
    );
    expect(
      opposing.asPlayerOne().playCard(dragonFire, {
        targets: [minnieMouseUrbanVisionary],
      }),
    ).not.toBeSuccessfulCommand();
    expect(opposing.asServer().getAvailableInk(PLAYER_ONE)).toBe(5);
    expect(opposing.asPlayerTwo().getCardZone(minnieMouseUrbanVisionary)).toBe("play");
    const friendly = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [dragonFire],
      inkwell: 5,
      play: [minnieMouseUrbanVisionary],
    });
    expect(
      friendly.asPlayerOne().playCard(dragonFire, {
        targets: [minnieMouseUrbanVisionary],
      }),
    ).toBeSuccessfulCommand();
    expect(friendly.asPlayerOne().getCardZone(minnieMouseUrbanVisionary)).toBe("discard");
  });

  it("returns only the selected duplicate ink instance", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: minnieMouseUrbanVisionary, isDrying: false, exerted: true }],
        inkwell: [inkCard, inkCard],
        deck: 3,
      },
      { deck: 3 },
    );
    const [chosenId, remainingId] = g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE);
    expect(chosenId).not.toBe(remainingId);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolvePendingByCard(minnieMouseUrbanVisionary)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolveNextPending({ resolveOptional: true })).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [chosenId!],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toEqual([chosenId!]);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toEqual([remainingId!]);
    expect(g.asPlayerOne().isExerted(remainingId!)).toBe(true);
  });

  it("a ready Minnie does not trigger at the end of her controller's turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: minnieMouseUrbanVisionary, isDrying: false }], inkwell: 2, deck: 3 },
      { deck: 3 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
  });

  it("does not trigger at the end of the opponent's turn even while exerted", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: minnieMouseUrbanVisionary, isDrying: false, exerted: true }],
        inkwell: 2,
        deck: 3,
      },
      { deck: 3 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolvePendingByCard(minnieMouseUrbanVisionary)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolveNextPending({ resolveOptional: false })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolveNextPending({ resolveOptional: false })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  for (const look of [false, true]) {
    for (const returnCard of [false, true]) {
      it(`look ${look}, return ${returnCard}: exerts own ink only if either choice is accepted`, () => {
        const secondInk = createMockCharacter({
          id: "minnie-branch-ink",
          name: "Other Ink",
          cost: 1,
        });
        const g = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [{ card: minnieMouseUrbanVisionary, isDrying: false, exerted: true }],
            inkwell: [inkCard, secondInk],
            deck: 3,
          },
          { inkwell: 2, deck: 3 },
        );
        expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
        expect(
          g.asPlayerOne().resolvePendingByCard(minnieMouseUrbanVisionary),
        ).toBeSuccessfulCommand();
        expect(
          g.asPlayerOne().resolveNextPending({ resolveOptional: look }),
        ).toBeSuccessfulCommand();
        expect(
          g.asPlayerOne().resolveNextPending({
            resolveOptional: returnCard,
            ...(returnCard ? { targets: [inkCard] } : {}),
          }),
        ).toBeSuccessfulCommand();
        expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(returnCard ? 1 : 0);
        expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(returnCard ? 1 : 2);
        expect(g.asPlayerOne().isExerted(secondInk)).toBe(look || returnCard);
        expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(2);
        expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
      });
    }
  }

  it("accepting the look must leave a separate optional return choice", () => {
    const secondInk = createMockCharacter({ id: "minnie-second-ink", name: "Second Ink", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: minnieMouseUrbanVisionary, isDrying: false, exerted: true }],
        inkwell: [inkCard, secondInk],
        deck: 3,
      },
      { deck: 3 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolvePendingByCard(minnieMouseUrbanVisionary)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolveNextPending({ resolveOptional: true })).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(2);
  });

  it("has Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [minnieMouseUrbanVisionary],
      inkwell: minnieMouseUrbanVisionary.cost,
    });

    expect(testEngine.asPlayerOne().playCard(minnieMouseUrbanVisionary)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: minnieMouseUrbanVisionary,
      keyword: "Ward",
    });
  });

  it("end of turn with exerted Minnie: look at inkwell, return one to hand, exert the rest", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [minnieMouseUrbanVisionary, inkCard],
      inkwell: minnieMouseUrbanVisionary.cost + 2,
    });

    expect(testEngine.asPlayerOne().playCard(minnieMouseUrbanVisionary)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(minnieMouseUrbanVisionary)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Accept the private look, then choose one card in the separate return step.
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(minnieMouseUrbanVisionary),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ resolveOptional: true }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [inkCard],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(inkCard)).toBe("hand");
  });
});
