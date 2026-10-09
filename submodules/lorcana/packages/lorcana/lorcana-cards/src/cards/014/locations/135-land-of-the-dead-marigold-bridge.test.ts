import { describe, expect, it } from "bun:test";
// CR 2.2.0: 3.2.2.2 (location lore in Set), 6.4.1/6.4.2 (continuous static effects).
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
  createMockAction,
  createMockSong,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { landOfTheDeadMarigoldBridge } from "./135-land-of-the-dead-marigold-bridge";

function discardFillers(prefix: string, count: number) {
  return Array.from({ length: count }, (_, index) =>
    createMockCharacter({
      id: `${prefix}-${index}`,
      name: `${prefix} ${index}`,
      cost: 1,
    }),
  );
}

describe("Land of the Dead - Marigold Bridge", () => {
  it("enters for four ink with its bonus but gains lore only on the next own turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [landOfTheDeadMarigoldBridge],
        inkwell: 4,
        discard: discardFillers("paid", 10),
        deck: 3,
      },
      { deck: 3 },
    );
    expect(g.asPlayerOne().playCard(landOfTheDeadMarigoldBridge)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getCardLore(landOfTheDeadMarigoldBridge)).toBe(3);
    expect(g.getLore(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(3);
  });

  it("cannot be played with fewer than four ink", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [landOfTheDeadMarigoldBridge],
      inkwell: 3,
    });
    expect(g.asPlayerOne().playCard(landOfTheDeadMarigoldBridge)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(landOfTheDeadMarigoldBridge)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(3);
  });

  it("can be inked without generating location lore", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [landOfTheDeadMarigoldBridge], discard: discardFillers("inked", 10), deck: 3 },
      { deck: 3 },
    );
    expect(
      g.asPlayerOne().putIntoInkwell(PLAYER_ONE, landOfTheDeadMarigoldBridge),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(landOfTheDeadMarigoldBridge)).toBe("inkwell");
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(0);
  });

  it("does not increase the lore of characters moved here", () => {
    const guest = createMockCharacter({ id: "bridge-guest", name: "Guest", cost: 1, lore: 2 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [landOfTheDeadMarigoldBridge, { card: guest, isDrying: false }],
      inkwell: 1,
      discard: discardFillers("guest", 10),
    });
    expect(
      g.asPlayerOne().moveCharacterToLocation(guest, landOfTheDeadMarigoldBridge),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getCardLore(guest)).toBe(2);
    expect(g.asPlayerOne().getCardLore(landOfTheDeadMarigoldBridge)).toBe(3);
    expect(g.asPlayerOne().quest(guest)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(2);
  });

  it("a banished location contributes no lore at its next turn", () => {
    const attacker = createMockCharacter({
      id: "bridge-attacker",
      name: "Attacker",
      cost: 1,
      strength: 8,
      willpower: 8,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [landOfTheDeadMarigoldBridge], discard: discardFillers("banished", 10), deck: 3 },
      { play: [{ card: attacker, isDrying: false }], deck: 3 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().challenge(attacker, landOfTheDeadMarigoldBridge),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(landOfTheDeadMarigoldBridge)).toBe("discard");
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(0);
  });

  it("a damaged location still gains its full current lore", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: landOfTheDeadMarigoldBridge, damage: 7 }],
        discard: discardFillers("damaged", 10),
        deck: 3,
      },
      { deck: 3 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(3);
  });

  it("can win with its three lore during the Set step", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        lore: 17,
        play: [landOfTheDeadMarigoldBridge],
        discard: discardFillers("winning", 10),
        deck: 3,
      },
      { deck: 3 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(20);
    expect(g.asServer().getWinner()).toBe(PLAYER_ONE);
  });

  for (const count of [0, 9, 10, 11])
    it("gains the current lore value at own turn start with " + count + " discarded cards", () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [landOfTheDeadMarigoldBridge],
          discard: discardFillers("threshold", count),
          deck: 4,
        },
        { deck: 4 },
      );
      const lore = count >= 10 ? 3 : 1;
      expect(g.asPlayerOne().getCardLore(landOfTheDeadMarigoldBridge)).toBe(lore);
      expect(g.getLore(PLAYER_ONE)).toBe(0);
      expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(g.getLore(PLAYER_ONE)).toBe(0);
      expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(g.getLore(PLAYER_ONE)).toBe(lore);
      expect(g.asPlayerOne().getBagCount()).toBe(0);
      expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(g.getLore(PLAYER_ONE)).toBe(lore * 2);
    });

  it("uses each location owner's discard for both players", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [landOfTheDeadMarigoldBridge], discard: discardFillers("p1", 9), deck: 3 },
      { play: [landOfTheDeadMarigoldBridge], discard: discardFillers("p2", 10), deck: 3 },
    );
    const own = g.findCardInstanceId(landOfTheDeadMarigoldBridge, "play", PLAYER_ONE);
    const other = g.findCardInstanceId(landOfTheDeadMarigoldBridge, "play", PLAYER_TWO);
    expect(g.asPlayerOne().getCardLore(own)).toBe(1);
    expect(g.asPlayerTwo().getCardLore(other)).toBe(3);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_TWO)).toBe(3);
    expect(g.getLore(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(1);
    expect(g.getLore(PLAYER_TWO)).toBe(3);
  });

  it("counts cards of every type in the discard", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [landOfTheDeadMarigoldBridge],
      discard: [
        ...discardFillers("mixed", 6),
        createMockItem({ id: "bridge-item", name: "Item", cost: 1 }),
        createMockLocation({ id: "bridge-location", name: "Location", cost: 1 }),
        createMockAction({ id: "bridge-action", name: "Action", cost: 1 }),
        createMockSong({ id: "bridge-song", name: "Song", cost: 1, text: "" }),
      ],
    });
    expect(g.asPlayerOne().getZonesCardCount().discard).toBe(10);
    expect(g.asPlayerOne().getCardLore(landOfTheDeadMarigoldBridge)).toBe(3);
  });

  it("multiple copies each get two extra lore rather than amplifying each other", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [landOfTheDeadMarigoldBridge, landOfTheDeadMarigoldBridge],
        discard: discardFillers("copies", 10),
        deck: 3,
      },
      { deck: 3 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(6);
  });

  for (const removeFirst of [false, true])
    it(`Player Two damaged copies grant only surviving bonuses; removal=${removeFirst}`, () => {
      const attacker = createMockCharacter({
        id: "bridge-p2-remover",
        name: "Remover",
        cost: 1,
        strength: 1,
        willpower: 3,
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: attacker, isDrying: false }, landOfTheDeadMarigoldBridge],
          discard: discardFillers("p1-nine", 9),
          deck: 4,
        },
        {
          play: [
            { card: landOfTheDeadMarigoldBridge, damage: 7 },
            { card: landOfTheDeadMarigoldBridge, damage: 6 },
          ],
          discard: discardFillers("p2-ten", 10),
          deck: 4,
        },
      );
      const copies = g.getCardInstanceIdsInZone("play", PLAYER_TWO);
      expect(copies).toHaveLength(2);
      const [first, second] = copies;
      if (!first || !second) throw new Error("Expected two Player Two Bridges");
      const opposing = g.findCardInstanceId(landOfTheDeadMarigoldBridge, "play", PLAYER_ONE);
      expect(g.asPlayerTwo().getCardLore(first)).toBe(3);
      expect(g.asPlayerTwo().getCardLore(second)).toBe(3);
      expect(g.asPlayerOne().getCardLore(opposing)).toBe(1);
      if (removeFirst) {
        expect(g.asPlayerOne().challenge(attacker, first)).toBeSuccessfulCommand();
        expect(g.asServer().getCardZone(first)).toBe("discard");
        expect(g.asServer().getCardLore(first)).toBe(1);
      }
      expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(g.getLore(PLAYER_TWO)).toBe(removeFirst ? 3 : 6);
      expect(g.getLore(PLAYER_ONE)).toBe(0);
      expect(g.asPlayerTwo().getCardLore(second)).toBe(3);
      expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
      expect(g.asPlayerTwo().getBagCount()).toBe(0);
    });

  it("updates immediately when cards enter and leave the discard", () => {
    const top = createMockCharacter({ id: "bridge-top", name: "Top Card", cost: 1 });
    const miller = createMockItem({
      id: "bridge-miller",
      name: "Miller",
      cost: 1,
      abilities: [
        {
          type: "activated",
          cost: { exert: true },
          effect: { type: "mill", amount: 1, target: "CONTROLLER" },
        },
      ],
    });
    const returner = createMockItem({
      id: "bridge-returner",
      name: "Returner",
      cost: 1,
      abilities: [
        {
          type: "activated",
          cost: { exert: true },
          effect: {
            type: "return-from-discard",
            cardType: "character",
            target: "CONTROLLER",
            destination: "hand",
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [landOfTheDeadMarigoldBridge, miller, returner],
      discard: discardFillers("changing", 9),
      deck: [top],
    });
    expect(g.asPlayerOne().getCardLore(landOfTheDeadMarigoldBridge)).toBe(1);
    expect(g.asPlayerOne().activateAbility(miller)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getZonesCardCount().discard).toBe(10);
    expect(g.asPlayerOne().getCardLore(landOfTheDeadMarigoldBridge)).toBe(3);
    expect(g.getLore(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().activateAbility(returner, { targets: [top] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(top)).toBe("hand");
    expect(g.asPlayerOne().getZonesCardCount().discard).toBe(9);
    expect(g.asPlayerOne().getCardLore(landOfTheDeadMarigoldBridge)).toBe(1);
    expect(g.getLore(PLAYER_ONE)).toBe(0);
  });

  it("Honored Offerings - gets +2 {L} while you have 10 or more cards in your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [landOfTheDeadMarigoldBridge],
      discard: discardFillers("marigold-filler", 10),
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCard(landOfTheDeadMarigoldBridge)?.lore).toBe(
      landOfTheDeadMarigoldBridge.lore + 2,
    );
  });

  it("Honored Offerings - does not get +2 {L} with fewer than 10 cards in your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [landOfTheDeadMarigoldBridge],
      discard: discardFillers("marigold-filler", 9),
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCard(landOfTheDeadMarigoldBridge)?.lore).toBe(
      landOfTheDeadMarigoldBridge.lore,
    );
  });

  it("Honored Offerings - only your own discard counts", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [landOfTheDeadMarigoldBridge],
        deck: 1,
      },
      {
        discard: discardFillers("marigold-opponent-filler", 10),
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().getCard(landOfTheDeadMarigoldBridge)?.lore).toBe(
      landOfTheDeadMarigoldBridge.lore,
    );
  });
});
