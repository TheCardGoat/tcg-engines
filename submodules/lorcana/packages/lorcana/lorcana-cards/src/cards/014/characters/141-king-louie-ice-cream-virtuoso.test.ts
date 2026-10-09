import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockAction,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { kingLouieIceCreamVirtuoso } from "./141-king-louie-ice-cream-virtuoso";

// CR 8.13.1 (Support), 6.7.6 (last known characteristics), 8.15 (Ward).
const boost = createMockAction({
  id: "louie-boost",
  name: "Boost",
  cost: 0,
  abilities: [
    {
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        duration: "this-turn",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
});

describe("King Louie - Ice Cream Virtuoso", () => {
  it.each([2, -1])(
    "Support reads current Strength at resolution after a %s change",
    (modifier: number) => {
      const observer = createMockItem({
        id: `louie-current-${modifier}`,
        name: "Current Strength Observer",
        cost: 1,
        abilities: [
          {
            type: "triggered",
            trigger: { event: "quest", on: "YOUR_CHARACTERS", timing: "whenever" },
            effect: {
              type: "modify-stat",
              stat: "strength",
              modifier,
              duration: "this-turn",
              target: "CHOSEN_CHARACTER",
            },
          },
        ],
      });
      const target = createMockCharacter({
        id: "louie-current-target",
        cost: 1,
        name: "Target",
        strength: 1,
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: kingLouieIceCreamVirtuoso, isDrying: false }, observer, target],
      });
      expect(g.asPlayerOne().quest(kingLouieIceCreamVirtuoso)).toBeSuccessfulCommand();
      expect(
        g.asPlayerOne().resolvePendingByCard(observer, { targets: [kingLouieIceCreamVirtuoso] }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardStrength(kingLouieIceCreamVirtuoso)).toBe(1 + modifier);
      expect(
        g.asPlayerOne().resolvePendingByCard(kingLouieIceCreamVirtuoso, {
          resolveOptional: true,
          targets: [target],
        }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardStrength(target)).toBe(modifier === 2 ? 4 : 1);
      expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    },
  );
  for (const effectType of ["banish", "return-to-hand"] as const) {
    it(`retained Support uses boosted last-known Strength after source ${effectType}`, () => {
      const observer = createMockItem({
        id: `louie-${effectType}`,
        name: "Quest Observer",
        cost: 1,
        abilities: [
          {
            type: "triggered",
            trigger: { event: "quest", on: "YOUR_CHARACTERS", timing: "whenever" },
            effect: { type: effectType, target: "CHOSEN_CHARACTER" },
          },
        ],
      });
      const target = createMockCharacter({
        id: "louie-lki-target",
        name: "Target",
        cost: 1,
        strength: 1,
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [boost],
          play: [{ card: kingLouieIceCreamVirtuoso, isDrying: false }, observer, target],
          deck: 4,
        },
        { deck: 4 },
      );
      expect(
        g.asPlayerOne().playCard(boost, { targets: [kingLouieIceCreamVirtuoso] }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardStrength(kingLouieIceCreamVirtuoso)).toBe(3);
      expect(g.asPlayerOne().quest(kingLouieIceCreamVirtuoso)).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getBagCount()).toBe(2);
      expect(
        g.asPlayerOne().resolvePendingByCard(observer, { targets: [kingLouieIceCreamVirtuoso] }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardZone(kingLouieIceCreamVirtuoso)).toBe(
        effectType === "banish" ? "discard" : "hand",
      );
      expect(
        g.asPlayerOne().resolvePendingByCard(kingLouieIceCreamVirtuoso, {
          resolveOptional: true,
          targets: [target],
        }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardStrength(target)).toBe(4);
      expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardStrength(target)).toBe(1);
    });
  }

  it("Player Two chooses another own Ward or opposing plain character, with exact filters and expiry", () => {
    const ward = createMockCharacter({
      id: "louie-ward",
      name: "Ward",
      cost: 1,
      strength: 2,
      abilities: [{ type: "keyword", keyword: "Ward" }],
    });
    const plain = createMockCharacter({ id: "louie-plain", name: "Plain", cost: 1, strength: 2 });
    const loc = createMockLocation({ id: "louie-location", name: "Location", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ward, plain], deck: 4 },
      {
        hand: [boost, plain],
        discard: [plain],
        play: [
          { card: kingLouieIceCreamVirtuoso, isDrying: false },
          { card: kingLouieIceCreamVirtuoso, isDrying: false },
          ward,
          loc,
        ],
        deck: 4,
      },
    );
    const [first, second] = g.getCardInstanceIdsInZone("play", PLAYER_TWO);
    if (!first || !second) throw new Error("Expected two King Louies");
    const ownWard = g.findCardInstanceId(ward, "play", PLAYER_TWO);
    const opposingWard = g.findCardInstanceId(ward, "play", PLAYER_ONE);
    const opposingPlain = g.findCardInstanceId(plain, "play", PLAYER_ONE);
    const hidden = g.findCardInstanceId(plain, "hand", PLAYER_TWO);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(boost, { targets: [first] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(first)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(first, { resolveOptional: true, targets: [ownWard] }),
    ).not.toBeSuccessfulCommand();
    for (const invalid of [first, opposingWard, hidden, loc])
      expect(
        g.asPlayerTwo().resolvePendingByCard(first, { resolveOptional: true, targets: [invalid] }),
      ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolvePendingByCard(first, { resolveOptional: true, targets: [ownWard] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardStrength(ownWard)).toBe(5);
    expect(g.asPlayerTwo().quest(second)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerTwo()
        .resolvePendingByCard(second, { resolveOptional: true, targets: [opposingPlain] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(opposingPlain)).toBe(3);
    expect(g.getLore(PLAYER_TWO)).toBe(5); // location Set one plus two two-lore quests
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardStrength(ownWard)).toBe(2);
    expect(g.asPlayerOne().getCardStrength(opposingPlain)).toBe(2);
  });

  it("repeated Support stacks a fixed bonus and target return/replay clears it", () => {
    const target = createMockCharacter({
      id: "louie-repeat-target",
      name: "Target",
      cost: 1,
      strength: 1,
    });
    const ready = createMockAction({
      id: "louie-ready",
      name: "Ready",
      cost: 0,
      abilities: [{ type: "action", effect: { type: "ready", target: "CHOSEN_CHARACTER" } }],
    });
    const bounce = createMockAction({
      id: "louie-target-bounce",
      name: "Bounce",
      cost: 0,
      abilities: [
        { type: "action", effect: { type: "return-to-hand", target: "CHOSEN_CHARACTER" } },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: kingLouieIceCreamVirtuoso, isDrying: false }, target],
      hand: [boost, ready, bounce],
      inkwell: 1,
    });
    expect(
      g.asPlayerOne().playCard(boost, { targets: [kingLouieIceCreamVirtuoso] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(kingLouieIceCreamVirtuoso)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveOnlyBag({ resolveOptional: true, targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(target)).toBe(4);
    expect(
      g.asPlayerOne().playCard(ready, { targets: [kingLouieIceCreamVirtuoso] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(kingLouieIceCreamVirtuoso)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveOnlyBag({ resolveOptional: true, targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(target)).toBe(7);
    expect(g.asPlayerOne().playCard(bounce, { targets: [target] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(target)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(target)).toBe(1);
  });

  it("Support with no other character completes without a choice or modifier", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: kingLouieIceCreamVirtuoso, isDrying: false }],
    });
    expect(g.asPlayerOne().quest(kingLouieIceCreamVirtuoso)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(kingLouieIceCreamVirtuoso)).toBe(1);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("has Support", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [kingLouieIceCreamVirtuoso],
      inkwell: kingLouieIceCreamVirtuoso.cost,
    });

    expect(testEngine.asPlayerOne().playCard(kingLouieIceCreamVirtuoso)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: kingLouieIceCreamVirtuoso,
      keyword: "Support",
    });
  });
  it.each([true, false])("Support can be accepted or declined (%s)", (accept: boolean) => {
    const target = createMockCharacter({
      id: "louie-target",
      name: "Target",
      cost: 1,
      strength: 1,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: kingLouieIceCreamVirtuoso, isDrying: false }, target],
        deck: 2,
      },
      { deck: 2 },
    );
    expect(testEngine.asPlayerOne().quest(kingLouieIceCreamVirtuoso)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({
        resolveOptional: accept,
        targets: accept ? [target] : undefined,
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(target)).toBe(
      1 + (accept ? kingLouieIceCreamVirtuoso.strength : 0),
    );
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(target)).toBe(1);
  });
});
