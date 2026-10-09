import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { thomasOmalleySavvyVagabond } from "./152-thomas-omalley-savvy-vagabond";

const cheapTop = createMockCharacter({ id: "omalley-cheap", name: "Cheap", cost: 1 });
const priceyTop = createMockItem({ id: "omalley-pricey", name: "Pricey", cost: 7 });

describe("Thomas O'Malley - Savvy Vagabond", () => {
  it("Player Two resolves independent quests through ties, one remaining card and empty decks", () => {
    const draw = createMockCharacter({ id: "omalley-draw", name: "Draw", cost: 3 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: [priceyTop, cheapTop] },
      {
        deck: [cheapTop, priceyTop, cheapTop, draw],
        play: Array.from({ length: 4 }, () => ({
          card: thomasOmalleySavvyVagabond,
          isDrying: false,
        })),
      },
    );
    const sources = g.getCardInstanceIdsInZone("play", PLAYER_TWO);
    const opponentCards = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    const ownCards = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(sources[0]!)).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toEqual([opponentCards[1]!]);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_TWO)).toEqual([ownCards[3]!, ownCards[2]!]);
    expect(g.asPlayerTwo().quest(sources[1]!)).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toEqual([
      opponentCards[1]!,
      opponentCards[0]!,
    ]);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_TWO)).toEqual([
      ownCards[3]!,
      ownCards[2]!,
      ownCards[1]!,
    ]);
    expect(g.asPlayerTwo().quest(sources[2]!)).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_TWO)).toEqual([
      ownCards[3]!,
      ownCards[2]!,
      ownCards[1]!,
      ownCards[0]!,
    ]);
    expect(g.asPlayerTwo().quest(sources[3]!)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_TWO)).toBe(8);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(2);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_TWO)).toHaveLength(4);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toHaveLength(0);
    expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(g.asPlayerTwo().getBagEffects()).toHaveLength(0);
  });

  it("Player Two's losing top goes below untouched cards and the next quest compares the new top", () => {
    const draw = createMockCharacter({ id: "omalley-p2-draw", name: "Draw", cost: 2 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: [cheapTop, priceyTop] },
      {
        deck: [priceyTop, cheapTop, draw],
        play: [
          { card: thomasOmalleySavvyVagabond, isDrying: false },
          { card: thomasOmalleySavvyVagabond, isDrying: false },
        ],
      },
    );
    const sources = g.getCardInstanceIdsInZone("play", PLAYER_TWO);
    const ownCards = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(sources[0]!)).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual([ownCards[1]!, ownCards[0]!]);
    expect(g.getCardDefinitionIdsInZone("hand", PLAYER_ONE)).toEqual([priceyTop.id]);
    expect(g.asPlayerTwo().quest(sources[1]!)).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_TWO)).toEqual([ownCards[2]!, ownCards[0]!]);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual([ownCards[1]!]);
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([cheapTop.id]);
    expect(g.getLore(PLAYER_TWO)).toBe(4);
  });

  it("another character's quest does not reveal or move either deck's cards", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: thomasOmalleySavvyVagabond, isDrying: false },
          { card: cheapTop, isDrying: false },
        ],
        deck: [priceyTop],
      },
      { deck: [cheapTop] },
    );
    const first = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    const second = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    expect(
      g.asPlayerOne().quest(g.findCardInstanceId(cheapTop, "play", PLAYER_ONE)!),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(first);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(second);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_TWO)).toHaveLength(0);
  });

  it("still gains quest lore when both decks are empty", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: [], play: [{ card: thomasOmalleySavvyVagabond, isDrying: false }] },
      { deck: [] },
    );
    expect(g.asPlayerOne().quest(thomasOmalleySavvyVagabond)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(2);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_TWO)).toHaveLength(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });
  it("puts both tied highest-cost cards into their owners' hands", () => {
    const tied = createMockItem({ id: "omalley-tied", name: "Tied", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: [cheapTop], play: [{ card: thomasOmalleySavvyVagabond, isDrying: false }] },
      { deck: [tied] },
    );
    expect(g.asPlayerOne().quest(thomasOmalleySavvyVagabond)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(cheapTop)).toBe("hand");
    expect(g.asPlayerTwo().getCardZone(tied)).toBe("hand");
    expect(g.getLore(PLAYER_ONE)).toBe(2);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toHaveLength(0);
  });

  it("moves the losing top card below the untouched cards", () => {
    const untouched = createMockCharacter({ id: "omalley-untouched", name: "Untouched", cost: 9 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: [untouched, cheapTop],
        play: [{ card: thomasOmalleySavvyVagabond, isDrying: false }],
      },
      { deck: [priceyTop] },
    );
    expect(g.asPlayerOne().quest(thomasOmalleySavvyVagabond)).toBeSuccessfulCommand();
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([cheapTop.id, untouched.id]);
    expect(g.asPlayerTwo().getCardZone(priceyTop)).toBe("hand");
    expect(g.asPlayerOne().getCardZone(untouched)).toBe("deck");
  });

  it("gives the only revealed card to its owner when the other deck is empty", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: [], play: [{ card: thomasOmalleySavvyVagabond, isDrying: false }] },
      { deck: [cheapTop] },
    );
    expect(g.asPlayerOne().quest(thomasOmalleySavvyVagabond)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(cheapTop)).toBe("hand");
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
    expect(g.getLore(PLAYER_ONE)).toBe(2);
  });
  it("on quest, routes the highest-cost top card to its player's hand and the rest to the bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [],
        inkwell: 2,
        deck: [cheapTop],
        play: [thomasOmalleySavvyVagabond],
      },
      { deck: [priceyTop] },
    );

    expect(testEngine.asPlayerOne().quest(thomasOmalleySavvyVagabond)).toBeSuccessfulCommand();

    // Player two's 7-cost card is the sole winner; player one's 1-cost card
    // goes to the bottom of their deck.
    expect(testEngine.asPlayerTwo().getCardZone(priceyTop)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(cheapTop)).toBe("deck");
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(1);
  });
});
