import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockLocation,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { baymaxQualifiedPhysician } from "./140-baymax-qualified-physician";

const hurtFriend = createMockCharacter({
  id: "baymax-patient",
  name: "Patient",
  cost: 2,
  strength: 2,
  willpower: 6,
});

describe("Baymax - Qualified Physician", () => {
  it("can heal friendly Ward but cannot choose opposing Ward", () => {
    const ward = createMockCharacter({
      id: "baymax-ward-patient",
      name: "Ward Patient",
      cost: 2,
      willpower: 6,
      abilities: [{ type: "keyword", keyword: "Ward" }],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: baymaxQualifiedPhysician, isDrying: false },
          { card: ward, damage: 3 },
        ],
      },
      { play: [{ card: ward, damage: 3 }] },
    );
    const own = g.findCardInstanceId(ward, "play", PLAYER_ONE);
    const enemy = g.getCardInstanceIdsInZone("play", "player_two")[0]!;
    expect(g.asPlayerOne().quest(baymaxQualifiedPhysician)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(baymaxQualifiedPhysician, { targets: [enemy] }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(baymaxQualifiedPhysician, { targets: [own] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(own)).toBe(1);
    expect(g.asPlayerTwo().getDamage(enemy)).toBe(3);
  });
  for (const amount of [-1, 3]) {
    it(`caps an out-of-range amount ${amount} to the printed zero-to-two range`, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: baymaxQualifiedPhysician, isDrying: false },
          { card: hurtFriend, damage: 3 },
        ],
      });
      expect(g.asPlayerOne().quest(baymaxQualifiedPhysician)).toBeSuccessfulCommand();
      expect(
        g
          .asPlayerOne()
          .resolvePendingByCard(baymaxQualifiedPhysician, { targets: [hurtFriend], amount }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getDamage(hurtFriend)).toBe(amount < 0 ? 3 : 1);
    });
  }
  for (const amount of [0, 1, 2]) {
    it(`can choose to remove exactly ${amount} damage`, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: baymaxQualifiedPhysician, isDrying: false },
          { card: hurtFriend, damage: 3 },
        ],
      });
      expect(g.asPlayerOne().quest(baymaxQualifiedPhysician)).toBeSuccessfulCommand();
      expect(g.getLore(PLAYER_ONE)).toBe(1);
      expect(g.isExerted(baymaxQualifiedPhysician)).toBe(true);
      expect(g.asPlayerOne().getDamage(hurtFriend)).toBe(3);
      expect(
        g
          .asPlayerOne()
          .resolvePendingByCard(baymaxQualifiedPhysician, { targets: [hurtFriend], amount }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getDamage(hurtFriend)).toBe(3 - amount);
    });
  }
  for (const damage of [0, 1, 2]) {
    it(`heals a character with ${damage} damage without creating negative damage`, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: baymaxQualifiedPhysician, isDrying: false },
          { card: hurtFriend, damage },
        ],
      });
      expect(g.asPlayerOne().quest(baymaxQualifiedPhysician)).toBeSuccessfulCommand();
      expect(
        g.asPlayerOne().resolvePendingByCard(baymaxQualifiedPhysician, { targets: [hurtFriend] }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getDamage(hurtFriend)).toBe(0);
    });
  }
  it("can heal itself", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: baymaxQualifiedPhysician, isDrying: false, damage: 3 }],
    });
    expect(g.asPlayerOne().quest(baymaxQualifiedPhysician)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(baymaxQualifiedPhysician, { targets: [baymaxQualifiedPhysician] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(baymaxQualifiedPhysician)).toBe(1);
  });
  it("can heal an opposing character", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: baymaxQualifiedPhysician, isDrying: false }] },
      { play: [{ card: hurtFriend, damage: 3 }] },
    );
    expect(g.asPlayerOne().quest(baymaxQualifiedPhysician)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(baymaxQualifiedPhysician, { targets: [hurtFriend] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(hurtFriend)).toBe(1);
  });
  for (const exerted of [false, true]) {
    it(`cannot quest while drying (exerted ${exerted}) and does not heal`, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: baymaxQualifiedPhysician, isDrying: true, exerted },
          { card: hurtFriend, damage: 3 },
        ],
      });
      expect(g.asPlayerOne().quest(baymaxQualifiedPhysician)).not.toBeSuccessfulCommand();
      expect(g.asPlayerOne().getDamage(hurtFriend)).toBe(3);
      expect(g.getLore(PLAYER_ONE)).toBe(0);
      expect(g.asPlayerOne().getBagCount()).toBe(0);
    });
  }
  for (const damage of [0, 1, 3]) {
    it(`Player Two owns the choice, rejects hidden/type-invalid targets and heals actual damage ${damage}`, () => {
      const location = createMockLocation({
        id: "baymax-invalid-location",
        name: "Location",
        cost: 1,
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card: hurtFriend, damage: 3 }], deck: 4 },
        {
          play: [
            { card: baymaxQualifiedPhysician, isDrying: false },
            { card: hurtFriend, damage: Math.min(damage, 1) },
            location,
          ],
          hand: [hurtFriend],
          discard: [hurtFriend],
          deck: 4,
        },
      );
      const own = g.findCardInstanceId(hurtFriend, "play", PLAYER_TWO);
      const opposing = g.findCardInstanceId(hurtFriend, "play", PLAYER_ONE);
      const target = damage === 3 ? opposing : own;
      const hand = g.findCardInstanceId(hurtFriend, "hand", PLAYER_TWO);
      const discard = g.findCardInstanceId(hurtFriend, "discard", PLAYER_TWO);
      expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(g.asPlayerTwo().quest(baymaxQualifiedPhysician)).toBeSuccessfulCommand();
      expect(g.getLore(PLAYER_TWO)).toBe(2); // location Set lore one, then quest one
      expect(
        g
          .asPlayerOne()
          .resolvePendingByCard(baymaxQualifiedPhysician, { targets: [target], amount: 2 }),
      ).not.toBeSuccessfulCommand();
      for (const invalid of [hand, discard, location]) {
        expect(
          g
            .asPlayerTwo()
            .resolvePendingByCard(baymaxQualifiedPhysician, { targets: [invalid], amount: 2 }),
        ).not.toBeSuccessfulCommand();
      }
      expect(g.asPlayerTwo().getDamage(target)).toBe(damage);
      expect(
        g
          .asPlayerTwo()
          .resolvePendingByCard(baymaxQualifiedPhysician, { targets: [target], amount: 2 }),
      ).toBeSuccessfulCommand();
      expect(g.asServer().getDamage(target)).toBe(Math.max(0, damage - 2));
      expect(g.asServer().getDamage(damage === 3 ? own : opposing)).toBe(damage === 3 ? 1 : 3);
      expect(g.asPlayerTwo().getBagCount()).toBe(0);
      expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    });
  }

  it("on quest, removes up to 2 damage from a chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [baymaxQualifiedPhysician],
        inkwell: baymaxQualifiedPhysician.cost,
        play: [{ card: hurtFriend, damage: 3 }],
      },
      {},
    );

    expect(testEngine.asPlayerOne().playCard(baymaxQualifiedPhysician)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(baymaxQualifiedPhysician)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(baymaxQualifiedPhysician, {
        targets: [hurtFriend],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({ card: hurtFriend, value: 1 });
  });
});
