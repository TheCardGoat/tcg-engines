// CR 2.2.0: 6.2.3/6.2.4 (trigger and resolution-time secondary condition),
// 6.1.11.1 (same card instance), 6.3.1.2 (immediate item activation),
// 1.8.1.2 (empty-deck loss at own turn end).
// Rules grounding: The Torn Corner (set14-133).
// Fond Memories {E}, 1 {I} — If you have 10 or more cards in your discard,
// draw a card. Mend the Photo — When this card is put into your discard from
// your deck, if you have an item named Rivera Family Photo in play, you may
// play this card from your discard for free.
//
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockItem,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { riveraFamilyPhoto } from "./132-rivera-family-photo";
import { theTornCorner } from "./133-the-torn-corner";

function filler(id: string) {
  return createMockCharacter({ id, name: `Torn Filler ${id}`, cost: 1 });
}

describe("The Torn Corner", () => {
  it("Fond Memories — draws a card with 10 or more cards in your discard", () => {
    const discardFillers = Array.from({ length: 10 }, (_, i) => filler(`discard-${i}`));
    const drawTarget = filler("draw-target");

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [theTornCorner],
      discard: discardFillers,
      deck: [drawTarget],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(theTornCorner, {
        ability: "Fond Memories",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawTarget)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(0);
  });

  it("Fond Memories — draws nothing with fewer than 10 cards in your discard", () => {
    const discardFillers = Array.from({ length: 9 }, (_, i) => filler(`short-${i}`));
    const deckCard = filler("deck-card");

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [theTornCorner],
      discard: discardFillers,
      deck: [deckCard],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(theTornCorner, {
        ability: "Fond Memories",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("deck");
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(1);
  });

  it("Fond Memories — negative requires 1 ink", () => {
    const discardFillers = Array.from({ length: 10 }, (_, i) => filler(`no-ink-${i}`));
    const deckCard = filler("no-ink-deck-card");

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [theTornCorner],
      discard: discardFillers,
      deck: [deckCard],
    });

    const result = testEngine.asPlayerOne().activateAbility(theTornCorner, {
      ability: "Fond Memories",
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().isExerted(theTornCorner)).toBe(false);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(1);
  });

  it.each([true, false])(
    "Mend the Photo — optional free play when milled (%s)",
    (accept: boolean) => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [riveraFamilyPhoto],
        inkwell: 1,
        deck: [theTornCorner, filler("mill-filler")],
      });
      expect(
        testEngine.asPlayerOne().activateAbility(riveraFamilyPhoto, {
          ability: "Honor the Past",
          choiceIndex: 0,
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(theTornCorner)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asServer()
          .getMoveLogHistory()
          .some((log) =>
            log.public.some(
              (message) =>
                message.key === "lorcana.outcome.cardsMilled" && message.values.amount === 2,
            ),
          ),
      ).toBe(true);
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          resolveOptional: accept,
          targets: accept ? [theTornCorner] : undefined,
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(theTornCorner)).toBe(accept ? "play" : "discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    },
  );
  it("Mend the Photo resolves without free play when Rivera Family Photo is absent", () => {
    const mill = createMockAction({
      id: "torn-mill",
      name: "Mill",
      cost: 0,
      abilities: [{ type: "action", effect: { type: "mill", amount: 1, target: "CONTROLLER" } }],
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mill],
      deck: [theTornCorner],
    });
    expect(testEngine.asPlayerOne().playCard(mill)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(theTornCorner)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
  it("Mend the Photo only plays the copy just milled, not an older copy", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [riveraFamilyPhoto],
      inkwell: 1,
      deck: [theTornCorner],
      discard: [theTornCorner],
    });
    const oldCopy = testEngine.findCardInstanceId(theTornCorner, "discard", PLAYER_ONE);
    const milledCopy = testEngine.findCardInstanceId(theTornCorner, "deck", PLAYER_ONE);
    expect(
      testEngine.asPlayerOne().activateAbility(riveraFamilyPhoto, {
        ability: "Honor the Past",
        choiceIndex: 0,
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asServer().getCard(oldCopy).zone).toBe("discard");
    expect(testEngine.asServer().getCard(milledCopy).zone).toBe("play");
  });
});

const spare = filler("boundary-spare");
const nextDraw = filler("boundary-draw");
const ownDiscard = Array.from({ length: 11 }, (_, i) => filler("boundary-discard-" + i));
const millOne = createMockAction({
  id: "torn-boundary-mill",
  name: "Mill One",
  cost: 0,
  abilities: [{ type: "action", effect: { type: "mill", amount: 1, target: "CONTROLLER" } }],
});
const discardOne = createMockAction({
  id: "torn-boundary-discard",
  name: "Discard One",
  cost: 0,
  abilities: [
    { type: "action", effect: { type: "discard", amount: 1, target: "CONTROLLER", chosen: true } },
  ],
});
const banishItem = createMockAction({
  id: "torn-boundary-banish",
  name: "Banish Item",
  cost: 0,
  abilities: [
    {
      type: "action",
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["item"],
        },
      },
    },
  ],
});

describe("The Torn Corner boundaries", () => {
  for (const count of [0, 9, 10, 11])
    it("Fond Memories spends one and exerts at discard count " + count, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theTornCorner],
          discard: ownDiscard.slice(0, count),
          inkwell: 2,
          deck: [spare, nextDraw],
        },
        { discard: ownDiscard, deck: [spare] },
      );
      expect(
        g.asPlayerOne().activateAbility(theTornCorner, { ability: "Fond Memories" }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardZone(nextDraw)).toBe(count >= 10 ? "hand" : "deck");
      expect(g.asPlayerOne().getZonesCardCount().deck).toBe(count >= 10 ? 1 : 2);
      expect(g.asPlayerOne().getZonesCardCount().discard).toBe(count);
      expect(g.asPlayerOne().isExerted(theTornCorner)).toBe(true);
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
      expect(g.asPlayerTwo().getZonesCardCount().deck).toBe(1);
      expect(g.asPlayerTwo().getZonesCardCount().hand).toBe(0);
      expect(
        g.asPlayerOne().activateAbility(theTornCorner, { ability: "Fond Memories" }).success,
      ).toBe(false);
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    });
  it("can play then activate the item immediately", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theTornCorner],
      discard: ownDiscard,
      inkwell: 4,
      deck: [spare, nextDraw],
    });
    expect(g.asPlayerOne().playCard(theTornCorner)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().activateAbility(theTornCorner, { ability: "Fond Memories" }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(nextDraw)).toBe("hand");
    expect(g.asPlayerOne().isExerted(theTornCorner)).toBe(true);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });
  it("draws nothing from an empty deck and loses only at own turn end", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [theTornCorner], discard: ownDiscard, inkwell: 1, deck: [] },
      { deck: [spare, nextDraw] },
    );
    expect(
      g.asPlayerOne().activateAbility(theTornCorner, { ability: "Fond Memories" }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(g.asPlayerOne().isExerted(theTornCorner)).toBe(true);
    expect(g.asServer().getWinner()).toBeUndefined();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asServer().getWinner()).toBe(PLAYER_TWO);
  });
  it("can pay Fond Memories with a held ink drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [theTornCorner],
      discard: ownDiscard,
      inkDrops: 1,
      deck: [spare, nextDraw],
    });
    expect(
      g.asPlayerOne().activateAbility(theTornCorner, { ability: "Fond Memories", inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getCardZone(nextDraw)).toBe("hand");
  });
  for (const photoZone of ["hand", "discard", "opponent", "missing"])
    it("does not free-play with Photo only in " + photoZone, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [millOne, ...(photoZone === "hand" ? [riveraFamilyPhoto] : [])],
          discard: photoZone === "discard" ? [riveraFamilyPhoto] : [],
          deck: [spare, theTornCorner],
        },
        { play: photoZone === "opponent" ? [riveraFamilyPhoto] : [], deck: [nextDraw] },
      );
      expect(g.asPlayerOne().playCard(millOne)).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardZone(theTornCorner)).toBe("discard");
      expect(g.asPlayerOne().getBagCount()).toBe(0);
    });
  it("does not trigger free play when discarded from hand", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [discardOne, theTornCorner],
      play: [riveraFamilyPhoto],
      deck: [spare],
    });
    expect(
      g.asPlayerOne().playCard(discardOne, { targets: [theTornCorner] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(theTornCorner)).toBe("discard");
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
  it("does not trigger free play when banished from play", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [banishItem],
      play: [theTornCorner, riveraFamilyPhoto],
      deck: [spare],
    });
    expect(
      g.asPlayerOne().playCard(banishItem, { targets: [theTornCorner] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(theTornCorner)).toBe("discard");
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
  it("drawing the card into hand does not trigger Mend the Photo", () => {
    const draw = createMockAction({
      id: "torn-boundary-draw",
      name: "Draw",
      cost: 0,
      abilities: [{ type: "action", effect: { type: "draw", amount: 1, target: "CONTROLLER" } }],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [draw],
      play: [riveraFamilyPhoto],
      deck: [spare, theTornCorner],
    });
    expect(g.asPlayerOne().playCard(draw)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(theTornCorner)).toBe("hand");
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
  it("free play consumes no ink, leaves the item ready and checks its new nine-card discard", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [millOne],
      play: [riveraFamilyPhoto],
      discard: ownDiscard.slice(0, 8),
      inkwell: 1,
      deck: [spare, nextDraw, theTornCorner],
    });
    expect(g.asPlayerOne().playCard(millOne)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getZonesCardCount().discard).toBe(10);
    expect(g.asPlayerOne().resolveOnlyBag({ resolveOptional: true })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(theTornCorner)).toBe("play");
    expect(g.asPlayerOne().isExerted(theTornCorner)).toBe(false);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getZonesCardCount().discard).toBe(9);
    expect(
      g.asPlayerOne().activateAbility(theTornCorner, { ability: "Fond Memories" }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(nextDraw)).toBe("deck");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });
  it("Mend the Photo belongs to the milled card's controller", () => {
    const millOpponent = createMockAction({
      id: "torn-boundary-opponent-mill",
      name: "Mill Opponent",
      cost: 0,
      abilities: [{ type: "action", effect: { type: "mill", amount: 1, target: "OPPONENT" } }],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [millOpponent], deck: [spare] },
      { play: [riveraFamilyPhoto], deck: [nextDraw, theTornCorner] },
    );
    expect(g.asPlayerOne().playCard(millOpponent)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getBagCount()).toBe(1);
    expect(g.asPlayerTwo().resolveOnlyBag({ resolveOptional: true })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(theTornCorner)).toBe("play");
    expect(g.asPlayerOne().getZonesCardCount().play).toBe(0);
  });
  it("is inkable without resolving either ability", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theTornCorner],
      play: [riveraFamilyPhoto],
      deck: [spare],
    });
    expect(g.asPlayerOne().putIntoInkwell(PLAYER_ONE, theTornCorner)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(theTornCorner)).toBe("inkwell");
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(1);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
});

// The named Photo is a secondary condition checked at resolution (CR 6.2.4).
it("Mend the Photo can see a Photo entering during the same resolving action", () => {
  const millThenPhoto = createMockAction({
    id: "torn-late-photo",
    name: "Mill then Photo",
    cost: 0,
    abilities: [
      {
        type: "action",
        effect: {
          type: "sequence",
          steps: [
            { type: "mill", amount: 1, target: "CONTROLLER" },
            {
              type: "play-card",
              cardType: "item",
              from: "hand",
              cost: "free",
              filter: { name: "Rivera Family Photo" },
            },
          ],
        },
      },
    ],
  });
  const g = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [millThenPhoto, riveraFamilyPhoto],
    deck: [spare, theTornCorner],
  });
  expect(
    g.asPlayerOne().playCard(millThenPhoto, { targets: [riveraFamilyPhoto] }),
  ).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardZone(riveraFamilyPhoto)).toBe("play");
  expect(g.asPlayerOne().getBagCount()).toBe(1);
  expect(g.asPlayerOne().resolveOnlyBag({ resolveOptional: true })).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardZone(theTornCorner)).toBe("play");
});

it("Mend the Photo rechecks the named Photo after another bag effect banishes it", () => {
  const remover = createMockItem({
    id: "torn-remove-photo",
    name: "Photo Remover",
    cost: 1,
    abilities: [
      {
        type: "triggered",
        trigger: {
          event: "discard",
          on: "SELF",
          timing: "when",
          restrictions: [{ type: "from-deck" }],
        },
        sourceZones: ["discard"],
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["play"],
            cardTypes: ["item"],
          },
        },
      },
    ],
  });
  const g = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [riveraFamilyPhoto],
    inkwell: 1,
    deck: [spare, theTornCorner, remover],
  });
  expect(
    g
      .asPlayerOne()
      .activateAbility(riveraFamilyPhoto, { ability: "Honor the Past", choiceIndex: 0 }),
  ).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getBagCount()).toBe(2);
  expect(
    g.asPlayerOne().resolvePendingByCard(remover, { targets: [riveraFamilyPhoto] }),
  ).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardZone(riveraFamilyPhoto)).toBe("discard");
  expect(g.asPlayerOne().getCardZone(theTornCorner)).toBe("discard");
  expect(g.asPlayerOne().getBagCount()).toBe(0);
});

it("two newly milled copies each free-play their own instance and leave an older copy in discard", () => {
  const millTwo = createMockAction({
    id: "torn-mill-two",
    name: "Mill Two",
    cost: 0,
    abilities: [{ type: "action", effect: { type: "mill", amount: 2, target: "CONTROLLER" } }],
  });
  const g = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [millTwo],
    play: [riveraFamilyPhoto],
    discard: [theTornCorner],
    deck: [spare, theTornCorner, theTornCorner],
  });
  const old = g.findCardInstanceId(theTornCorner, "discard", PLAYER_ONE);
  const spareId = g.findCardInstanceId(spare, "deck", PLAYER_ONE);
  const newCopies = g.getCardInstanceIdsInZone("deck", PLAYER_ONE).filter((id) => id !== spareId);
  expect(newCopies).toHaveLength(2);
  expect(g.asPlayerOne().playCard(millTwo)).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getBagCount()).toBe(2);
  for (const id of newCopies) {
    expect(
      g.asPlayerOne().resolvePendingByCard(id, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(id)).toBe("play");
  }
  expect(g.asPlayerOne().getCardZone(old)).toBe("discard");
  expect(g.asPlayerOne().getBagCount()).toBe(0);
  expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
});

it("Fond Memories readies next own turn and draws again after ink refresh", () => {
  const normalDraw = filler("refresh-normal-draw");
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [theTornCorner],
      discard: ownDiscard.slice(0, 10),
      inkwell: 1,
      deck: [spare, normalDraw, nextDraw],
    },
    { deck: [filler("refresh-opponent-spare"), filler("refresh-opponent-draw")] },
  );
  expect(
    g.asPlayerOne().activateAbility(theTornCorner, { ability: "Fond Memories" }),
  ).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardZone(nextDraw)).toBe("hand");
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(g.asPlayerOne().isExerted(theTornCorner)).toBe(false);
  expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
  expect(
    g.asPlayerOne().activateAbility(theTornCorner, { ability: "Fond Memories" }),
  ).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardZone(spare)).toBe("hand");
  expect(g.asPlayerOne().getZonesCardCount().hand).toBe(3);
  expect(g.asPlayerOne().isExerted(theTornCorner)).toBe(true);
  expect(g.asServer().getWinner()).toBeUndefined();
});

// CR 6.1.11.1/6.2.3/6.2.4: distinct instances and the controller of the trigger.
it("Player Two accepts one new Corner, declines another and immediately draws at exactly ten", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [riveraFamilyPhoto], discard: ownDiscard, deck: [spare, nextDraw] },
    {
      play: [riveraFamilyPhoto, theTornCorner],
      discard: [...ownDiscard.slice(0, 8), theTornCorner],
      inkwell: 3,
      inkDrops: 2,
      deck: [spare, nextDraw, theTornCorner, theTornCorner, filler("torn-p2-turn-draw")],
    },
  );
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const owner = g.asPlayerTwo();
  const beforeDeck = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
  const beforeDiscard = g.getCardInstanceIdsInZone("discard", PLAYER_TWO);
  const opposingDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
  const opposingDiscard = g.getCardInstanceIdsInZone("discard", PLAYER_ONE);
  const original = g.findCardInstanceId(theTornCorner, "play", PLAYER_TWO);
  const photoId = g.findCardInstanceId(riveraFamilyPhoto, "play", PLAYER_TWO);
  const [accepted, declined] = beforeDeck.slice(-2);
  expect(owner.activateAbility(original, { ability: "Fond Memories" })).toBeSuccessfulCommand();
  expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(beforeDeck);
  expect(
    owner.activateAbility(photoId, { ability: "Honor the Past", choiceIndex: 0 }),
  ).toBeSuccessfulCommand();
  expect(owner.getBagCount()).toBe(2);
  expect(g.getCardInstanceIdsInZone("discard", PLAYER_TWO)).toEqual([
    ...beforeDiscard,
    declined!,
    accepted!,
  ]);
  expect(g.asPlayerOne().resolvePendingByCard(accepted!, { resolveOptional: true }).success).toBe(
    false,
  );
  expect(owner.getBagCount()).toBe(2);
  expect(owner.resolvePendingByCard(accepted!, { resolveOptional: true })).toBeSuccessfulCommand();
  expect(g.getCardInstanceIdsInZone("play", PLAYER_TWO)).toEqual([photoId, original, accepted!]);
  expect(g.getCardInstanceIdsInZone("discard", PLAYER_TWO)).toEqual([...beforeDiscard, declined!]);
  expect(owner.isExerted(accepted!)).toBe(false);
  expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(1);
  expect(owner.resolvePendingByCard(declined!, { resolveOptional: false })).toBeSuccessfulCommand();
  expect(owner.getBagCount()).toBe(0);
  const beforeHand = g.getCardInstanceIdsInZone("hand", PLAYER_TWO);
  expect(owner.activateAbility(accepted!, { ability: "Fond Memories" })).toBeSuccessfulCommand();
  expect(g.getCardInstanceIdsInZone("hand", PLAYER_TWO)).toEqual([...beforeHand, beforeDeck[1]!]);
  expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual([beforeDeck[0]!]);
  expect(owner.isExerted(accepted!)).toBe(true);
  expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(g.getInkDrops(PLAYER_TWO)).toBe(2);
  expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(opposingDeck);
  expect(g.getCardInstanceIdsInZone("discard", PLAYER_ONE)).toEqual(opposingDiscard);
});
for (const size of [0, 1])
  it(
    "Player Two's ten-card Fond Memories draws the available " +
      size +
      " and loses at own turn end",
    () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: [spare, nextDraw], discard: ownDiscard },
        {
          play: [theTornCorner],
          inkwell: 1,
          discard: ownDiscard.slice(0, 10),
          deck: [...[spare].slice(0, size), nextDraw],
        },
      );
      expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      const beforeDeck = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
      const beforeHand = g.getCardInstanceIdsInZone("hand", PLAYER_TWO);
      const beforeDiscard = g.getCardInstanceIdsInZone("discard", PLAYER_TWO);
      const opposingDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      expect(
        g.asPlayerTwo().activateAbility(theTornCorner, { ability: "Fond Memories" }),
      ).toBeSuccessfulCommand();
      expect(g.getCardInstanceIdsInZone("hand", PLAYER_TWO)).toEqual([
        ...beforeHand,
        ...beforeDeck,
      ]);
      expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual([]);
      expect(g.getCardInstanceIdsInZone("discard", PLAYER_TWO)).toEqual(beforeDiscard);
      expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
      expect(g.asPlayerTwo().isExerted(theTornCorner)).toBe(true);
      expect(g.asServer().getWinner()).toBeUndefined();
      expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(g.asServer().getWinner()).toBe(PLAYER_ONE);
      expect(g.asServer().getTurnNumber()).toBe(2);
      expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(opposingDeck);
    },
  );
