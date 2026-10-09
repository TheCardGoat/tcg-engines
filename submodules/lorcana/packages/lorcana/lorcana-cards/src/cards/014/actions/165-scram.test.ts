// Rules grounding: Scram! inks an opposing character of cost 2 or less into
// that character's owner's inkwell, facedown and exerted. CR 8.15.1 applies Ward;
// CR 7.5.6 keeps the card facedown. The printed cost filter does not require inkability.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { scram } from "./165-scram";

const cheapOpposingCharacter = createMockCharacter({
  id: "scram-cheap-opposing",
  name: "Cheap Minion",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const priceyOpposingCharacter = createMockCharacter({
  id: "scram-pricey-opposing",
  name: "Pricey Minion",
  cost: 3,
  strength: 3,
  willpower: 5,
});

const cheapOwnCharacter = createMockCharacter({
  id: "scram-cheap-own",
  name: "Cheap Ally",
  cost: 1,
  strength: 1,
  willpower: 2,
});

describe("Scram!", () => {
  for (const cost of [0, 1]) {
    it(`inks a cost-${cost} noninkable character exerted until its player's next turn`, () => {
      const target = createMockCharacter({
        id: "scram-zero-noninkable",
        name: "Zero Cost",
        cost,
        inkable: false,
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [scram], inkwell: 1, deck: 6 },
        { play: [target], inkwell: 2, deck: 6 },
      );
      const targetId = g.findCardInstanceId(target, "play", PLAYER_TWO);
      expect(g.asPlayerOne().playCard(scram, { targets: [targetId] })).toBeSuccessfulCommand();
      expect(g.getCardInstanceIdsInZone("play", PLAYER_TWO)).toHaveLength(0);
      expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toContain(targetId);
      expect(g.isExerted(targetId)).toBe(true);
      expect(g.isCardFaceDown(targetId, "inkwell", PLAYER_TWO)).toBe(true);
      expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(2);
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
      expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(3);
      expect(g.isExerted(targetId)).toBe(false);
      expect(g.isCardFaceDown(targetId, "inkwell", PLAYER_TWO)).toBe(true);
      expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    });
  }

  it("can be played with no legal opposing target and resolves without moving cards", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [scram], inkwell: 1 },
      { play: [priceyOpposingCharacter], inkwell: 2 },
    );
    expect(g.asPlayerOne().playCard(scram)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(scram)).toBe("discard");
    expect(g.asPlayerTwo().getCardZone(priceyOpposingCharacter)).toBe("play");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("does not add ready ink to the target player and pays exactly one ink", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [scram], inkwell: 2 },
      { play: [cheapOpposingCharacter], inkwell: 2 },
    );
    expect(
      g.asPlayerOne().playCard(scram, { targets: [cheapOpposingCharacter] }),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toHaveLength(3);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(2);
    expect(g.asPlayerOne().getCardZone(scram)).toBe("discard");
  });

  it("rejects Ward and item targets before payment then accepts a legal retry", () => {
    const ward = createMockCharacter({
      id: "scram-ward",
      name: "Ward",
      cost: 2,
      abilities: [{ type: "keyword", keyword: "Ward" }],
    });
    const item = createMockItem({ id: "scram-item", name: "Item", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [scram], inkwell: 1 },
      { play: [ward, item, cheapOpposingCharacter] },
    );
    for (const target of [ward, item]) {
      expect(g.asPlayerOne().playCard(scram, { targets: [target] })).not.toBeSuccessfulCommand();
      expect(g.asPlayerTwo().getCardZone(target)).toBe("play");
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
      expect(g.asPlayerOne().getCardZone(scram)).toBe("hand");
    }
    expect(
      g.asPlayerOne().playCard(scram, { targets: [cheapOpposingCharacter] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(cheapOpposingCharacter)).toBe("inkwell");
  });

  it("rejects insufficient payment without moving the target", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [scram] },
      { play: [cheapOpposingCharacter] },
    );
    expect(
      g.asPlayerOne().playCard(scram, { targets: [cheapOpposingCharacter] }),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(scram)).toBe("hand");
    expect(g.asPlayerTwo().getCardZone(cheapOpposingCharacter)).toBe("play");
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toHaveLength(0);
  });

  it("ordinary inking adds ready ink without moving an opposing character", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [scram] },
      { play: [cheapOpposingCharacter] },
    );
    expect(g.asPlayerOne().putIntoInkwell(PLAYER_ONE, scram)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerTwo().getCardZone(cheapOpposingCharacter)).toBe("play");
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("rejects multiple or repeated target IDs atomically before an exact duplicate retry", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [scram], inkwell: 1, deck: 3 },
      { play: [cheapOpposingCharacter, cheapOpposingCharacter], inkwell: 2, deck: 3 },
    );
    const [first, second] = g.getCardInstanceIdsInZone("play", PLAYER_TWO);
    for (const targets of [
      [first!, second!],
      [first!, first!],
    ]) {
      expect(g.asPlayerOne().playCard(scram, { targets })).not.toBeSuccessfulCommand();
      expect(g.getCardInstanceIdsInZone("play", PLAYER_TWO)).toEqual([first!, second!]);
      expect(g.asPlayerOne().getCardZone(scram)).toBe("hand");
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
      expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toHaveLength(2);
    }
    expect(g.asPlayerOne().playCard(scram, { targets: [second!] })).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("play", PLAYER_TWO)).toEqual([first!]);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toContain(second!);
    expect(g.isExerted(second!)).toBe(true);
    expect(g.isCardFaceDown(second!, "inkwell", PLAYER_TWO)).toBe(true);
  });

  it("player two inks only the selected opposing duplicate instance", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [cheapOpposingCharacter, cheapOpposingCharacter],
        inkwell: 2,
        deck: [cheapOwnCharacter],
      },
      { hand: [scram], inkwell: 1, deck: [cheapOwnCharacter, cheapOwnCharacter] },
    );
    const [selected, untouched] = g.getCardInstanceIdsInZone("play", PLAYER_ONE);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(scram, { targets: [selected!] })).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("play", PLAYER_ONE)).toEqual([untouched!]);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toContain(selected!);
    expect(g.isCardFaceDown(selected!, "inkwell", PLAYER_ONE)).toBe(true);
    expect(g.isExerted(selected!)).toBe(true);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
  });

  it("puts a chosen opposing character with cost 2 or less into their player's inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [scram],
        inkwell: scram.cost,
      },
      {
        play: [cheapOpposingCharacter],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(scram, {
        targets: [cheapOpposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    // Goes to the opposing player's inkwell, not the controller's.
    expect(testEngine.asPlayerTwo().getCardZone(cheapOpposingCharacter)).toBe("inkwell");
    expect(testEngine.isExerted(cheapOpposingCharacter)).toBe(true);
    expect(testEngine.isCardFaceDown(cheapOpposingCharacter, "inkwell", PLAYER_TWO)).toBe(true);
  });

  it("cannot target an opposing character with cost 3 or more", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [scram],
        inkwell: scram.cost,
      },
      {
        play: [priceyOpposingCharacter],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(scram, {
        targets: [priceyOpposingCharacter],
      }).success,
    ).toBe(false);

    expect(testEngine.asPlayerTwo().getCardZone(priceyOpposingCharacter)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(scram)).toBe("hand");
    expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
  });

  it("cannot target your own character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [scram],
      inkwell: scram.cost,
      play: [cheapOwnCharacter],
    });

    expect(
      testEngine.asPlayerOne().playCard(scram, {
        targets: [cheapOwnCharacter],
      }).success,
    ).toBe(false);

    expect(testEngine.asPlayerOne().getCardZone(cheapOwnCharacter)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(scram)).toBe("hand");
    expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
  });
});
