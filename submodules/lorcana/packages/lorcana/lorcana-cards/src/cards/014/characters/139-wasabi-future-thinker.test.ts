import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { wasabiFutureThinker } from "./139-wasabi-future-thinker";

const teammate = createMockCharacter({
  id: "wasabi-teammate",
  name: "Teammate",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Wasabi - Future Thinker", () => {
  for (const amount of [1, 2]) {
    it(`reduces friendly effect damage ${amount} by one, with a zero floor`, () => {
      const damage = createMockAction({
        id: `wasabi-damage-${amount}`,
        name: "Damage",
        cost: 0,
        abilities: [
          { type: "action", effect: { type: "deal-damage", amount, target: "CHOSEN_CHARACTER" } },
        ],
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [wasabiFutureThinker, damage],
        inkwell: 4,
        inkDrops: 1,
        play: [teammate],
      });
      expect(
        g.asPlayerOne().playCard(wasabiFutureThinker, { inkDrops: 1 }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().playCard(damage, { targets: [teammate] })).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getDamage(teammate)).toBe(amount - 1);
    });
  }
  it("Ward blocks an opponent's chosen effect but permits a challenge with reduced damage", () => {
    const attacker = createMockCharacter({
      id: "wasabi-attacker",
      name: "Attacker",
      cost: 2,
      strength: 2,
      willpower: 4,
    });
    const damage = createMockAction({
      id: "wasabi-enemy-damage",
      name: "Enemy Damage",
      cost: 0,
      abilities: [
        { type: "action", effect: { type: "deal-damage", amount: 2, target: "CHOSEN_CHARACTER" } },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [wasabiFutureThinker],
        inkwell: 4,
        inkDrops: 1,
        play: [{ card: teammate, exerted: true, isDrying: false }],
        deck: 6,
      },
      { hand: [damage], play: [{ card: attacker, isDrying: false }], deck: 6 },
    );
    expect(g.asPlayerOne().playCard(wasabiFutureThinker, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(damage, { targets: [teammate] })).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(teammate)).toBe(0);
    expect(g.asPlayerTwo().challenge(attacker, teammate)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(teammate)).toBe(1);
    expect(g.asPlayerTwo().getDamage(attacker)).toBe(2);
    expect(g.asPlayerOne().getCardZone(teammate)).toBe("play");
  });
  it("keeps the granted protection after Wasabi leaves play", () => {
    const banish = createMockAction({
      id: "wasabi-banish",
      name: "Banish",
      cost: 0,
      abilities: [{ type: "action", effect: { type: "banish", target: "CHOSEN_CHARACTER" } }],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [wasabiFutureThinker], inkwell: 4, inkDrops: 1, play: [teammate], deck: 6 },
      { hand: [banish], deck: 6 },
    );
    expect(g.asPlayerOne().playCard(wasabiFutureThinker, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().playCard(banish, { targets: [wasabiFutureThinker] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(wasabiFutureThinker)).toBe("discard");
    expect(g.asPlayerOne()).toHaveKeyword({ card: teammate, keyword: "Ward" });
    expect(g.asPlayerOne()).toHaveKeyword({ card: teammate, keyword: "Resist", value: 1 });
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).not.toHaveKeyword({ card: teammate, keyword: "Ward" });
    expect(g.asPlayerOne()).not.toHaveKeyword({ card: teammate, keyword: "Resist" });
  });
  it("without paying an ink drop, other characters gain nothing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [wasabiFutureThinker],
        inkwell: wasabiFutureThinker.cost,
        play: [teammate],
      },
      {},
    );

    expect(testEngine.asPlayerOne().playCard(wasabiFutureThinker)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(teammate)).toBe("play");
    // No Resist/ Ward granted — teammate keeps plain stats.
    expect(testEngine.asPlayerOne().getCardStrength(teammate)).toBe(2);
    expect(testEngine.asPlayerOne()).not.toHaveKeyword({ card: teammate, keyword: "Resist" });
    expect(testEngine.asPlayerOne()).not.toHaveKeyword({ card: teammate, keyword: "Ward" });
  });

  it("protects only existing other friendly characters and expires at the next own turn", () => {
    const opponent = createMockCharacter({ id: "wasabi-opponent", name: "Opponent", cost: 1 });
    const lateArrival = createMockCharacter({ id: "wasabi-late", name: "Late Arrival", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [wasabiFutureThinker, lateArrival],
        inkwell: 5,
        inkDrops: 1,
        play: [teammate],
        deck: 6,
      },
      { play: [opponent], deck: 6 },
    );
    expect(g.asPlayerOne().playCard(wasabiFutureThinker, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne()).toHaveKeyword({ card: teammate, keyword: "Ward" });
    expect(g.asPlayerOne()).toHaveKeyword({ card: teammate, keyword: "Resist", value: 1 });
    expect(g.asPlayerOne()).not.toHaveKeyword({ card: wasabiFutureThinker, keyword: "Ward" });
    expect(g.asPlayerOne()).not.toHaveKeyword({ card: wasabiFutureThinker, keyword: "Resist" });
    expect(g.asPlayerTwo()).not.toHaveKeyword({ card: opponent, keyword: "Ward" });
    expect(g.asPlayerTwo()).not.toHaveKeyword({ card: opponent, keyword: "Resist" });
    expect(g.asPlayerOne().playCard(lateArrival)).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).not.toHaveKeyword({ card: lateArrival, keyword: "Ward" });
    expect(g.asPlayerOne()).not.toHaveKeyword({ card: lateArrival, keyword: "Resist" });
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveKeyword({ card: teammate, keyword: "Ward" });
    expect(g.asPlayerOne()).toHaveKeyword({ card: teammate, keyword: "Resist", value: 1 });
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).not.toHaveKeyword({ card: teammate, keyword: "Ward" });
    expect(g.asPlayerOne()).not.toHaveKeyword({ card: teammate, keyword: "Resist" });
  });

  it("Player Two copies stack only on characters present at each resolution, survive source return and expire together", () => {
    const late = createMockCharacter({ id: "wasabi-p2-late", name: "Late", cost: 1 });
    const latest = createMockCharacter({ id: "wasabi-p2-latest", name: "Latest", cost: 0 });
    const damage = createMockAction({
      id: "wasabi-p2-two-damage",
      name: "Two Damage",
      cost: 0,
      abilities: [
        { type: "action", effect: { type: "deal-damage", amount: 2, target: "CHOSEN_CHARACTER" } },
      ],
    });
    const bounce = createMockAction({
      id: "wasabi-p2-bounce",
      name: "Bounce",
      cost: 0,
      abilities: [
        { type: "action", effect: { type: "return-to-hand", target: "CHOSEN_CHARACTER" } },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [teammate], deck: 6 },
      {
        play: [teammate],
        hand: [wasabiFutureThinker, wasabiFutureThinker, late, latest, damage, bounce],
        inkwell: 10,
        inkDrops: 2,
        deck: 6,
      },
    );
    const sources = g.getCardInstanceIdsInZone("hand", PLAYER_TWO).slice(0, 2);
    const [first, second] = sources;
    if (!first || !second) throw new Error("Expected two Wasabi copies");
    const own = g.findCardInstanceId(teammate, "play", PLAYER_TWO);
    const opposing = g.findCardInstanceId(teammate, "play", PLAYER_ONE);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(first, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(late)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo()).not.toHaveKeyword({ card: late, keyword: "Resist" });
    expect(g.asPlayerTwo().playCard(second, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(1);
    expect(g.asPlayerTwo()).toHaveKeyword({ card: own, keyword: "Resist", value: 2 });
    expect(g.asPlayerTwo()).toHaveKeyword({ card: first, keyword: "Resist", value: 1 });
    expect(g.asPlayerTwo()).toHaveKeyword({ card: late, keyword: "Resist", value: 1 });
    expect(g.asPlayerTwo()).not.toHaveKeyword({ card: second, keyword: "Resist" });
    expect(g.asPlayerOne()).not.toHaveKeyword({ card: opposing, keyword: "Ward" });
    expect(g.asPlayerTwo().playCard(latest)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo()).not.toHaveKeyword({ card: latest, keyword: "Ward" });
    expect(g.asPlayerTwo()).not.toHaveKeyword({ card: latest, keyword: "Resist" });
    expect(g.asPlayerTwo().playCard(damage, { targets: [own] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(own)).toBe(0);
    expect(g.asPlayerTwo().playCard(bounce, { targets: [first] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(first)).toBe("hand");
    expect(g.asPlayerTwo()).toHaveKeyword({ card: own, keyword: "Resist", value: 2 });
    expect(g.asPlayerTwo()).toHaveKeyword({ card: own, keyword: "Ward" });
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo()).toHaveKeyword({ card: own, keyword: "Resist", value: 2 });
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    for (const card of [own, late]) {
      expect(g.asPlayerTwo()).not.toHaveKeyword({ card, keyword: "Ward" });
      expect(g.asPlayerTwo()).not.toHaveKeyword({ card, keyword: "Resist" });
    }
    expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });

  it("when an ink drop was removed to play him, other characters gain Resist +1 and Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [wasabiFutureThinker],
        inkwell: wasabiFutureThinker.cost - 1,
        inkDrops: 1,
        play: [teammate],
      },
      {},
    );

    expect(
      testEngine.asPlayerOne().playCard(wasabiFutureThinker, { inkDrops: 1 }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: teammate,
      keyword: "Resist",
      value: 1,
    });
    expect(testEngine.asPlayerOne()).toHaveKeyword({ card: teammate, keyword: "Ward" });
  });
});
