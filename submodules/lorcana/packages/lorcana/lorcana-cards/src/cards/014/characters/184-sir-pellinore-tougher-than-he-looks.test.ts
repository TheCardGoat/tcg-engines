// CR 4.6.6.2–4.6.8.3: simultaneous challenge damage and location distinction.
// CR 6.2.3, 6.2.5 and 8.5.1–8.5.2: per-victory turn-gated trigger, attacking-only Challenger.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockAction,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { sirPellinoreTougherThanHeLooks } from "./184-sir-pellinore-tougher-than-he-looks";
import { fanTheFlames } from "../../001/actions/131-fan-the-flames";

const doomedVictim = createMockCharacter({
  id: "pellinore-victim",
  name: "Doomed Victim",
  cost: 1,
  strength: 0,
  willpower: 3,
});

describe("Sir Pellinore - Tougher Than He Looks", () => {
  it("a Player Two victory rewards only the exact source and its drop pays for a card", () => {
    const purchase = createMockCharacter({ id: "pellinore-purchase", name: "Purchase", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: doomedVictim, exerted: true }], deck: 3 },
      {
        play: [sirPellinoreTougherThanHeLooks, sirPellinoreTougherThanHeLooks],
        hand: [purchase],
        deck: 3,
      },
    );
    const sources = g.getCardInstanceIdsInZone("play", "player_two");
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().challenge(sources[1]!, doomedVictim)).toBeSuccessfulCommand();
    expect(g.getInkDrops("player_two")).toBe(1);
    expect(g.getInkDrops("player_one")).toBe(0);
    expect(g.isExerted(sources[0]!)).toBe(false);
    expect(g.isExerted(sources[1]!)).toBe(true);
    expect(g.asPlayerTwo().playCard(purchase, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(purchase)).toBe("play");
    expect(g.getInkDrops("player_two")).toBe(0);
    expect(g.asServer().getAvailableInk("player_two")).toBe(0);
    expect(g.asPlayerTwo().getBagCount()).toBe(0);
  });

  it("action damage banishment does not grant a victory reward", () => {
    const damageAction = createMockAction({
      id: "pellinore-action-damage",
      name: "Action Damage",
      cost: 0,
      abilities: [
        { type: "action", effect: { type: "deal-damage", amount: 3, target: "CHOSEN_CHARACTER" } },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [sirPellinoreTougherThanHeLooks], hand: [damageAction], deck: 3 },
      { play: [doomedVictim], deck: 3 },
    );
    expect(
      g.asPlayerOne().playCard(damageAction, { targets: [doomedVictim] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(doomedVictim)).toBe("discard");
    expect(g.getInkDrops("player_one")).toBe(0);
    expect(g.getInkDrops("player_two")).toBe(0);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });

  it("awards one drop per victory when Pellinore is readied for a second challenge", () => {
    const second = createMockCharacter({
      id: "pellinore-second-victim",
      name: "Second Victim",
      cost: 1,
      strength: 0,
      willpower: 3,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: sirPellinoreTougherThanHeLooks, isDrying: false }],
        hand: [fanTheFlames],
        inkwell: 1,
        deck: 3,
      },
      {
        play: [
          { card: doomedVictim, exerted: true },
          { card: second, exerted: true },
        ],
        deck: 3,
      },
    );
    expect(
      g.asPlayerOne().challenge(sirPellinoreTougherThanHeLooks, doomedVictim),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops("player_one")).toBe(1);
    expect(
      g.asPlayerOne().playCard(fanTheFlames, { targets: [sirPellinoreTougherThanHeLooks] }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().challenge(sirPellinoreTougherThanHeLooks, second),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops("player_one")).toBe(2);
    expect(g.asPlayerTwo().getCardZone(second)).toBe("discard");
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });

  it("paid entry costs three and cannot challenge or quest until the next turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [sirPellinoreTougherThanHeLooks], inkwell: 3, deck: 3 },
      { play: [{ card: doomedVictim, exerted: true }], deck: 3 },
    );
    expect(g.asPlayerOne().playCard(sirPellinoreTougherThanHeLooks)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk("player_one")).toBe(0);
    expect(
      g.asPlayerOne().challenge(sirPellinoreTougherThanHeLooks, doomedVictim),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(sirPellinoreTougherThanHeLooks)).not.toBeSuccessfulCommand();
    expect(g.getInkDrops("player_one")).toBe(0);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(sirPellinoreTougherThanHeLooks)).toBeSuccessfulCommand();
    expect(g.getLore("player_one")).toBe(1);
    expect(g.getInkDrops("player_one")).toBe(0);
  });

  it("unpaid play rejects and inking Pellinore adds one ready ink without a drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [sirPellinoreTougherThanHeLooks],
      inkwell: 2,
      deck: 3,
    });
    expect(g.asPlayerOne().playCard(sirPellinoreTougherThanHeLooks)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(sirPellinoreTougherThanHeLooks)).toBe("hand");
    expect(g.asServer().getAvailableInk("player_one")).toBe(2);
    expect(
      g.asPlayerOne().putIntoInkwell("player_one", sirPellinoreTougherThanHeLooks),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk("player_one")).toBe(3);
    expect(g.getInkDrops("player_one")).toBe(0);
  });

  it("cannot challenge a ready victim and awards no drop for the rejected action", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: sirPellinoreTougherThanHeLooks, isDrying: false }], deck: 3 },
      { play: [{ card: doomedVictim, isDrying: false }], deck: 3 },
    );
    expect(
      g.asPlayerOne().challenge(sirPellinoreTougherThanHeLooks, doomedVictim),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().isExerted(sirPellinoreTougherThanHeLooks)).toBe(false);
    expect(g.asPlayerTwo().getDamage(doomedVictim)).toBe(0);
    expect(g.getInkDrops("player_one")).toBe(0);
  });

  it("deals three to a surviving character without gaining a drop", () => {
    const victim = createMockCharacter({
      id: "pellinore-survivor",
      name: "Survivor",
      cost: 1,
      strength: 2,
      willpower: 4,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: sirPellinoreTougherThanHeLooks, isDrying: false }], deck: 3 },
      { play: [{ card: victim, exerted: true }], deck: 3 },
    );
    expect(
      g.asPlayerOne().challenge(sirPellinoreTougherThanHeLooks, victim),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(victim)).toBe(3);
    expect(g.asPlayerTwo().getCardZone(victim)).toBe("play");
    expect(g.asPlayerOne().getDamage(sirPellinoreTougherThanHeLooks)).toBe(2);
    expect(g.getInkDrops("player_one")).toBe(0);
    expect(g.asPlayerOne().getCardStrength(sirPellinoreTougherThanHeLooks)).toBe(1);
  });

  it("gains a drop even when both characters are banished in his challenge", () => {
    const victim = createMockCharacter({
      id: "pellinore-mutual",
      name: "Mutual Victim",
      cost: 1,
      strength: 5,
      willpower: 3,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: sirPellinoreTougherThanHeLooks, isDrying: false }], deck: 3 },
      { play: [{ card: victim, exerted: true }], deck: 3 },
    );
    expect(
      g.asPlayerOne().challenge(sirPellinoreTougherThanHeLooks, victim),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(sirPellinoreTougherThanHeLooks)).toBe("discard");
    expect(g.asPlayerTwo().getCardZone(victim)).toBe("discard");
    expect(g.getInkDrops("player_one")).toBe(1);
    expect(g.getInkDrops("player_two")).toBe(0);
  });

  it("banishing a location grants no drop", () => {
    const location = createMockLocation({
      id: "pellinore-location",
      name: "Location",
      cost: 1,
      willpower: 3,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: sirPellinoreTougherThanHeLooks, isDrying: false }], deck: 3 },
      { play: [location], deck: 3 },
    );
    expect(
      g.asPlayerOne().challenge(sirPellinoreTougherThanHeLooks, location),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(location)).toBe("discard");
    expect(g.getInkDrops("player_one")).toBe(0);
    expect(g.asPlayerOne().getDamage(sirPellinoreTougherThanHeLooks)).toBe(0);
  });

  it("another friendly character's challenge victory does not trigger Pellinore", () => {
    const ally = createMockCharacter({
      id: "pellinore-ally",
      name: "Ally",
      cost: 1,
      strength: 3,
      willpower: 4,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [sirPellinoreTougherThanHeLooks, { card: ally, isDrying: false }], deck: 3 },
      { play: [{ card: doomedVictim, exerted: true }], deck: 3 },
    );
    expect(g.asPlayerOne().challenge(ally, doomedVictim)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(doomedVictim)).toBe("discard");
    expect(g.getInkDrops("player_one")).toBe(0);
  });

  it("player two gains the drop from their own attack", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: doomedVictim, exerted: true }], deck: 3 },
      { play: [{ card: sirPellinoreTougherThanHeLooks, isDrying: false }], deck: 3 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(doomedVictim)).not.toBeSuccessfulCommand();
    // The first player's character readies only on their own next turn.
    expect(
      g.asPlayerTwo().challenge(sirPellinoreTougherThanHeLooks, doomedVictim),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops("player_two")).toBe(1);
    expect(g.getInkDrops("player_one")).toBe(0);
  });

  it("has Challenger +2 and gains an ink drop when he banishes a character in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: sirPellinoreTougherThanHeLooks, isDrying: false }], deck: 3 },
      { play: [{ card: doomedVictim, exerted: true }], deck: 3 },
    );
    expect(
      testEngine.asPlayerOne().challenge(sirPellinoreTougherThanHeLooks, doomedVictim),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(doomedVictim)).toBe("discard");
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerOne().getCardStrength(sirPellinoreTougherThanHeLooks)).toBe(1);
    expect(testEngine.asPlayerOne().isExerted(sirPellinoreTougherThanHeLooks)).toBe(true);
  });

  it("grants no ink drop when he banishes an attacker on an opposing turn", () => {
    const weakAttacker = createMockCharacter({
      id: "pellinore-weak-attacker",
      name: "Weak Attacker",
      cost: 1,
      strength: 1,
      willpower: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: sirPellinoreTougherThanHeLooks, exerted: true }],
      },
      { play: [{ card: weakAttacker, isDrying: false }] },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(weakAttacker, sirPellinoreTougherThanHeLooks),
    ).toBeSuccessfulCommand();

    // The 1 {S} attacker banishes into Pellinore's 5 {W}, but it is not
    // Pellinore's controller's turn, so SPOILS OF VICTORY stays quiet.
    expect(testEngine.asPlayerTwo().getCardZone(weakAttacker)).toBe("discard");
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
  });
});
