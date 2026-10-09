import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { ward } from "../../../helpers/abilities";
import { bellwetherHighlyQualified } from "./159-bellwether-highly-qualified";

const cheapEnemy = createMockCharacter({
  id: "bellwether-victim",
  name: "Cheap Victim",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const priceyEnemy = createMockCharacter({
  id: "bellwether-pricey",
  name: "Pricey Victim",
  cost: 3,
  strength: 3,
  willpower: 5,
});

// CR 6.1.4, 6.2.3: each own entry has one optional effect controlled by that player.
// CR 8.15.1 and 7.5.6: opposing Ward cannot be chosen; legal cards enter facedown ink.
// https://files.disneylorcana.com/Comprehensive-Rules_2.2.0-EN.pdf
describe("Bellwether - Highly Qualified", () => {
  for (const cost of [0, 1]) {
    it(`accepts an opposing noninkable character with printed cost ${cost}`, () => {
      const victim = createMockCharacter({
        id: "bell-low-" + cost,
        name: "Low Cost",
        cost,
        inkable: false,
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [bellwetherHighlyQualified], inkwell: 4, deck: 3 },
        { play: [victim], inkwell: 1, deck: 3 },
      );
      expect(g.asPlayerOne().playCard(bellwetherHighlyQualified)).toBeSuccessfulCommand();
      expect(
        g.asPlayerOne().resolvePendingByCard(bellwetherHighlyQualified, {
          resolveOptional: true,
          targets: [victim],
        }),
      ).toBeSuccessfulCommand();
      const id = g.findCardInstanceId(victim, "inkwell", PLAYER_TWO)!;
      expect(g.isCardFaceDown(id, "inkwell", PLAYER_TWO)).toBe(true);
      expect(g.asPlayerTwo().isExerted(id)).toBe(true);
      expect(g.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(1);
    });
  }

  it("rejects multiple and duplicate targets atomically before one exact valid retry", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [bellwetherHighlyQualified], inkwell: 4, deck: 3 },
      { play: [cheapEnemy, cheapEnemy], inkwell: 1, deck: 3 },
    );
    const before = g.getCardInstanceIdsInZone("play", PLAYER_TWO);
    expect(g.asPlayerOne().playCard(bellwetherHighlyQualified)).toBeSuccessfulCommand();
    for (const targets of [before, [before[0]!, before[0]!]]) {
      expect(
        g
          .asPlayerOne()
          .resolvePendingByCard(bellwetherHighlyQualified, { resolveOptional: true, targets }),
      ).not.toBeSuccessfulCommand();
      expect(g.getCardInstanceIdsInZone("play", PLAYER_TWO)).toEqual(before);
      expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toHaveLength(1);
      expect(g.asPlayerOne().getBagCount()).toBe(1);
    }
    expect(
      g.asPlayerOne().resolvePendingByCard(bellwetherHighlyQualified, {
        resolveOptional: true,
        targets: [before[1]!],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("play", PLAYER_TWO)).toEqual([before[0]!]);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toContain(before[1]!);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });

  it("later Bellwether entry triggers only the new copy and has an independent choice", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [bellwetherHighlyQualified, bellwetherHighlyQualified], inkwell: 8, deck: 3 },
      { play: [cheapEnemy], inkwell: 1, deck: 3 },
    );
    const hand = g.getCardInstanceIdsInZone("hand", PLAYER_ONE);
    expect(g.asPlayerOne().playCard(hand[0]!)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(1);
    expect(
      g.asPlayerOne().resolvePendingByCard(hand[0]!, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(cheapEnemy)).toBe("play");
    expect(g.asPlayerOne().playCard(hand[1]!)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(1);
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(hand[1]!, { resolveOptional: true, targets: [cheapEnemy] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(cheapEnemy)).toBe("inkwell");
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
  it("player two inks only the chosen opposing duplicate instance", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [cheapEnemy, cheapEnemy], inkwell: 1, deck: 3 },
      { hand: [bellwetherHighlyQualified], inkwell: 4, deck: 3 },
    );
    const [chosenId, otherId] = g.getCardInstanceIdsInZone("play", PLAYER_ONE);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(bellwetherHighlyQualified)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(bellwetherHighlyQualified, {
        resolveOptional: true,
        targets: [chosenId!],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolvePendingByCard(bellwetherHighlyQualified, {
        resolveOptional: true,
        targets: [chosenId!],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("play", PLAYER_ONE)).toEqual([otherId!]);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toContain(chosenId!);
    expect(g.isCardFaceDown(chosenId!, "inkwell", PLAYER_ONE)).toBe(true);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toHaveLength(4);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
  });

  it("can finish its play without a legal opposing target", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [bellwetherHighlyQualified], inkwell: 4, deck: 3 },
      { play: [priceyEnemy], deck: 3 },
    );
    expect(g.asPlayerOne().playCard(bellwetherHighlyQualified)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(bellwetherHighlyQualified)).toBe("play");
    expect(g.asPlayerTwo().getCardZone(priceyEnemy)).toBe("play");
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toHaveLength(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });

  it("rejects friendly characters, opposing items and Ward, then allows a legal retry", () => {
    const friendly = createMockCharacter({ id: "bell-friendly", name: "Friendly", cost: 1 });
    const wardEnemy = createMockCharacter({
      id: "bell-ward",
      name: "Protected",
      cost: 2,
      abilities: [ward],
    });
    const item = createMockItem({ id: "bell-item", name: "Item", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [bellwetherHighlyQualified], play: [friendly], inkwell: 4, deck: 3 },
      { play: [wardEnemy, item, cheapEnemy], deck: 3 },
    );
    expect(g.asPlayerOne().playCard(bellwetherHighlyQualified)).toBeSuccessfulCommand();
    for (const target of [friendly, wardEnemy, item]) {
      expect(
        g.asPlayerOne().resolvePendingByCard(bellwetherHighlyQualified, {
          resolveOptional: true,
          targets: [target],
        }),
      ).not.toBeSuccessfulCommand();
      expect(g.asServer().getCardZone(target)).toBe("play");
    }
    expect(
      g.asPlayerOne().resolvePendingByCard(bellwetherHighlyQualified, {
        resolveOptional: true,
        targets: [cheapEnemy],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(cheapEnemy)).toBe("inkwell");
  });

  it("failed payment creates no trigger and Bellwether cannot be inked", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [bellwetherHighlyQualified], inkwell: 3, deck: 3 },
      { play: [cheapEnemy], deck: 3 },
    );
    expect(g.asPlayerOne().playCard(bellwetherHighlyQualified)).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().putIntoInkwell(PLAYER_ONE, bellwetherHighlyQualified),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(bellwetherHighlyQualified)).toBe("hand");
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(g.asPlayerTwo().getCardZone(cheapEnemy)).toBe("play");
  });

  it("declining keeps the opposing character and their ink unchanged", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [bellwetherHighlyQualified], inkwell: 4, deck: 3 },
      { play: [cheapEnemy], inkwell: 2, deck: 3 },
    );
    expect(g.asPlayerOne().playCard(bellwetherHighlyQualified)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(bellwetherHighlyQualified, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(cheapEnemy)).toBe("play");
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toHaveLength(2);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("puts a chosen opposing character of cost 2 or less into their inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [bellwetherHighlyQualified],
        inkwell: bellwetherHighlyQualified.cost,
      },
      { play: [cheapEnemy] },
    );

    expect(testEngine.asPlayerOne().playCard(bellwetherHighlyQualified)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(bellwetherHighlyQualified, {
        resolveOptional: true,
        targets: [cheapEnemy],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(cheapEnemy)).toBe("inkwell");
    expect(testEngine.isCardFaceDown(cheapEnemy, "inkwell", PLAYER_TWO)).toBe(true);
    expect(testEngine.asPlayerTwo().getCard(cheapEnemy).exerted).toBe(true);
    expect(testEngine.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("can't target an opposing character costing more than 2", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [bellwetherHighlyQualified],
        inkwell: bellwetherHighlyQualified.cost,
      },
      { play: [priceyEnemy, cheapEnemy] },
    );

    expect(testEngine.asPlayerOne().playCard(bellwetherHighlyQualified)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(bellwetherHighlyQualified, {
        resolveOptional: true,
        targets: [priceyEnemy],
      }),
    ).not.toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(priceyEnemy)).toBe("play");
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(bellwetherHighlyQualified, {
        resolveOptional: true,
        targets: [cheapEnemy],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(cheapEnemy)).toBe("inkwell");
  });
});
