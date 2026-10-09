import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
  createMockItem,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { lionheartCleaningUpTheCity } from "./147-lionheart-cleaning-up-the-city";
import { evasive } from "../../../helpers/abilities/evasive";

// CR 8.2.1–8.2.2 (Alert), 6.3.1.1 (non-exert activation), 1.9.2.3 (remove damage), 8.15.1 (Ward).
const damaged = createMockCharacter({
  id: "lionheart-patient",
  name: "Patient",
  cost: 2,
  strength: 2,
  willpower: 5,
});

describe("Lionheart - Cleaning Up the City", () => {
  it.each(["self", "own-location", "opposing-character", "own-ward", "zero"] as const)(
    "Player Two heals %s while exerted, paying five ink plus one drop",
    (kind: string) => {
      const location = createMockLocation({
        id: "lionheart-own-location",
        name: "City",
        cost: 1,
        willpower: 8,
        lore: 0,
      });
      const ward = createMockCharacter({
        id: "lionheart-ward",
        name: "Ward",
        cost: 1,
        willpower: 5,
        abilities: [{ type: "keyword", keyword: "Ward" }],
      });
      const zero = createMockCharacter({ id: "lionheart-zero", name: "Undamaged", cost: 1 });
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card: damaged, damage: 3 }], deck: 4 },
        {
          play: [
            { card: lionheartCleaningUpTheCity, isDrying: false, damage: 4 },
            { card: location, damage: 7 },
            { card: ward, damage: 2 },
            zero,
          ],
          inkwell: 5,
          inkDrops: 1,
          deck: 4,
        },
      );
      expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(g.asPlayerTwo().quest(lionheartCleaningUpTheCity)).toBeSuccessfulCommand();
      const target =
        kind === "self"
          ? lionheartCleaningUpTheCity
          : kind === "own-location"
            ? location
            : kind === "opposing-character"
              ? damaged
              : kind === "own-ward"
                ? ward
                : zero;
      expect(
        g
          .asPlayerTwo()
          .activateAbility(lionheartCleaningUpTheCity, { targets: [target], inkDrops: 1 }),
      ).toBeSuccessfulCommand();
      expect(g.asServer().getDamage(target)).toBe(0);
      expect(g.asServer().getDamage(kind === "self" ? ward : lionheartCleaningUpTheCity)).toBe(
        kind === "self" ? 2 : 4,
      );
      expect(g.asPlayerTwo().isExerted(lionheartCleaningUpTheCity)).toBe(true);
      expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
      expect(g.getInkDrops(PLAYER_TWO)).toBe(0);
      expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
      expect(
        g.asPlayerTwo().activateAbility(lionheartCleaningUpTheCity, { targets: [target] }),
      ).not.toBeSuccessfulCommand();
      expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    },
  );

  it("rejects hidden, item and opposing Ward targets without paying, and protects the pending chooser", () => {
    const ward = createMockCharacter({
      id: "lionheart-enemy-ward",
      name: "Ward",
      cost: 1,
      willpower: 5,
      abilities: [{ type: "keyword", keyword: "Ward" }],
    });
    const item = createMockItem({ id: "lionheart-item", name: "Item", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [lionheartCleaningUpTheCity, item, { card: damaged, damage: 3 }],
        hand: [damaged],
        discard: [damaged],
        inkwell: 6,
      },
      { play: [{ card: ward, damage: 2 }] },
    );
    const invalid = [
      item,
      ward,
      g.findCardInstanceId(damaged, "hand", PLAYER_ONE),
      g.findCardInstanceId(damaged, "discard", PLAYER_ONE),
    ];
    for (const target of invalid) {
      expect(
        g.asPlayerOne().activateAbility(lionheartCleaningUpTheCity, { targets: [target] }),
      ).not.toBeSuccessfulCommand();
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(6);
      expect(g.asServer().getDamage(damaged)).toBe(3);
    }
    expect(g.asPlayerOne().activateAbility(lionheartCleaningUpTheCity)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(
      g.asPlayerTwo().resolvePendingByCard(lionheartCleaningUpTheCity, { targets: [damaged] }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(lionheartCleaningUpTheCity, { targets: [damaged] }),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getDamage(damaged)).toBe(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("Alert is attack-only: Player Two challenges Evasive, then a plain attacker can challenge Lionheart", () => {
    const defender = createMockCharacter({
      id: "lionheart-alert-defender",
      name: "Evasive",
      cost: 1,
      strength: 1,
      willpower: 8,
      abilities: [evasive],
    });
    const plain = createMockCharacter({
      id: "lionheart-plain-attacker",
      name: "Plain",
      cost: 1,
      strength: 2,
      willpower: 8,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: defender, exerted: true },
          { card: plain, isDrying: false },
        ],
        deck: 4,
      },
      { play: [{ card: lionheartCleaningUpTheCity, isDrying: false }], deck: 4 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().challenge(lionheartCleaningUpTheCity, defender)).toBeSuccessfulCommand();
    expect(g.asServer().getDamage(defender)).toBe(3);
    expect(g.asServer().getDamage(lionheartCleaningUpTheCity)).toBe(1);
    expect(g.asPlayerTwo()).not.toHaveKeyword({
      card: lionheartCleaningUpTheCity,
      keyword: "Evasive",
    });
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().challenge(plain, lionheartCleaningUpTheCity)).toBeSuccessfulCommand();
    expect(g.asServer().getDamage(lionheartCleaningUpTheCity)).toBe(3);
    expect(g.asServer().getDamage(plain)).toBe(3);
  });

  it("Alert does not let a drying Lionheart challenge Evasive", () => {
    const defender = createMockCharacter({
      id: "lionheart-fresh-evasive",
      name: "Evasive",
      cost: 1,
      abilities: [evasive],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: lionheartCleaningUpTheCity, isDrying: true }] },
      { play: [{ card: defender, exerted: true }] },
    );
    expect(
      g.asPlayerOne().challenge(lionheartCleaningUpTheCity, defender),
    ).not.toBeSuccessfulCommand();
    expect(g.asServer().getDamage(defender)).toBe(0);
  });

  it("Civic Duty can activate while both drying and exerted without changing either state", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: lionheartCleaningUpTheCity, isDrying: true, exerted: true, damage: 4 },
        damaged,
      ],
      inkwell: 12,
    });
    expect(
      g
        .asPlayerOne()
        .activateAbility(lionheartCleaningUpTheCity, { targets: [lionheartCleaningUpTheCity] }),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getDamage(lionheartCleaningUpTheCity)).toBe(0);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(6);
    expect(g.asPlayerOne().isExerted(lionheartCleaningUpTheCity)).toBe(true);
    expect(
      g.asPlayerOne().activateAbility(lionheartCleaningUpTheCity, { targets: [damaged] }),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getDamage(damaged)).toBe(0);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().isExerted(lionheartCleaningUpTheCity)).toBe(true);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("keeps Civic Duty's printed index in its pending target prompt", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [lionheartCleaningUpTheCity, { card: damaged, damage: 3 }], inkwell: 6 },
      {},
    );
    expect(g.asPlayerOne().activateAbility(lionheartCleaningUpTheCity)).toBeSuccessfulCommand();
    const [pending] = g.asPlayerOne().getPendingEffects();
    expect(pending?.abilityIndex).toBe(1);
  });
  for (const exerted of [true, false]) {
    it(`Alert ${exerted ? "permits an exerted" : "does not permit a ready"} Evasive defender`, () => {
      const defender = createMockCharacter({
        id: "lionheart-evasive",
        name: "Evasive Defender",
        cost: 1,
        strength: 1,
        willpower: 8,
        abilities: [evasive],
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card: lionheartCleaningUpTheCity, isDrying: false }] },
        { play: [{ card: defender, exerted }] },
      );
      const result = g.asPlayerOne().challenge(lionheartCleaningUpTheCity, defender);
      if (exerted) {
        expect(result).toBeSuccessfulCommand();
        expect(g.asPlayerTwo()).toHaveDamage({ card: defender, value: 3 });
        expect(g.asPlayerOne().isExerted(lionheartCleaningUpTheCity)).toBe(true);
      } else {
        expect(result).not.toBeSuccessfulCommand();
        expect(g.asPlayerTwo()).toHaveDamage({ card: defender, value: 0 });
        expect(g.asPlayerOne().isExerted(lionheartCleaningUpTheCity)).toBe(false);
      }
    });
  }
  it("cannot pay Civic Duty with only five ink", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [lionheartCleaningUpTheCity, { card: damaged, damage: 3 }], inkwell: 5 },
      {},
    );
    expect(
      g.asPlayerOne().activateAbility(lionheartCleaningUpTheCity, { targets: [damaged] }),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveDamage({ card: damaged, value: 3 });
  });

  it("heals an opposing location without exerting Lionheart and can activate again", () => {
    const location = createMockLocation({
      id: "lionheart-location",
      name: "City",
      cost: 2,
      willpower: 8,
      moveCost: 1,
      lore: 0,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [lionheartCleaningUpTheCity, { card: damaged, damage: 3 }], inkwell: 12 },
      { play: [{ card: location, damage: 7 }] },
    );
    expect(
      g.asPlayerOne().activateAbility(lionheartCleaningUpTheCity, { targets: [location] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveDamage({ card: location, value: 0 });
    expect(g.asPlayerOne().isExerted(lionheartCleaningUpTheCity)).toBe(false);
    expect(
      g.asPlayerOne().activateAbility(lionheartCleaningUpTheCity, { targets: [damaged] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveDamage({ card: damaged, value: 0 });
  });
  it("has Alert and removes all damage from a chosen character for 6 {I}", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [lionheartCleaningUpTheCity],
        inkwell: 10,
        play: [{ card: damaged, damage: 3 }],
      },
      {},
    );

    expect(testEngine.asPlayerOne().playCard(lionheartCleaningUpTheCity)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: lionheartCleaningUpTheCity,
      keyword: "Alert",
    });

    expect(
      testEngine.asPlayerOne().activateAbility(lionheartCleaningUpTheCity, {
        targets: [damaged],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({ card: damaged, value: 0 });
  });
});
