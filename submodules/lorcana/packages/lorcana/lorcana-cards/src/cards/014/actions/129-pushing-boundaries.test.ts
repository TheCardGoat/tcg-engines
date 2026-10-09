// CR 2.2.0: 4.6.4.5–4.6.9.2 (whole challenge window), 6.1.13.4
// (this turn), 1.7.7 (no legal target), 8.15.1 (own Ward is legal).
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockItem,
  createMockLocation,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { pushingBoundaries } from "./129-pushing-boundaries";

const attacker = createMockCharacter({
  id: "pushing-boundaries-attacker",
  name: "Brave Attacker",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const bigDefender = createMockCharacter({
  id: "pushing-boundaries-defender",
  name: "Big Defender",
  cost: 5,
  strength: 5,
  willpower: 8,
});

describe("Pushing Boundaries", () => {
  it("protects the chosen character of yours from challenge damage this turn and gets 1 ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [pushingBoundaries],
        inkwell: pushingBoundaries.cost,
        play: [attacker],
      },
      {
        play: [{ card: bigDefender, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(pushingBoundaries, {
        targets: [attacker],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);

    expect(testEngine.asPlayerOne().challenge(attacker, bigDefender).success).toBe(true);

    // Attacker took no damage from the challenge; defender took the attacker's strength.
    expect(testEngine.asPlayerOne().getDamage(attacker)).toBe(0);
    expect(testEngine.asPlayerOne().getDamage(bigDefender)).toBe(attacker.strength);
  });

  it("does not protect a character that was not chosen", () => {
    const unchosen = createMockCharacter({
      id: "pushing-boundaries-unchosen",
      name: "Unchosen Character",
      cost: 1,
      strength: 1,
      willpower: 5,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [pushingBoundaries],
        inkwell: pushingBoundaries.cost,
        play: [attacker, unchosen],
      },
      {
        play: [{ card: bigDefender, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(pushingBoundaries, {
        targets: [attacker],
      }),
    ).toBeSuccessfulCommand();

    // The unchosen character challenges and is banished by the defender's 5
    // strength (5 damage on 5 willpower); only the chosen attacker is immune.
    expect(testEngine.asPlayerOne().challenge(unchosen, bigDefender).success).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(unchosen)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(attacker)).toBe("play");
    expect(testEngine.asPlayerOne().getDamage(attacker)).toBe(0);
  });

  it("costs 2 ink to play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [pushingBoundaries],
      inkwell: pushingBoundaries.cost - 1,
      play: [attacker],
    });

    expect(testEngine.asPlayerOne().playCard(pushingBoundaries).success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(pushingBoundaries)).toBe("hand");
  });
});

const triggerAttacker = createMockCharacter({
  id: "boundaries-trigger-attacker",
  name: "Trigger Attacker",
  cost: 2,
  strength: 2,
  willpower: 5,
  abilities: [
    {
      type: "triggered",
      trigger: { event: "challenge", on: "SELF", timing: "whenever" },
      effect: { type: "deal-damage", amount: 1, target: "SELF" },
    },
  ],
});
it("prevents effect damage during its chosen character's challenge declaration window", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [pushingBoundaries], play: [{ card: triggerAttacker, isDrying: false }], inkwell: 2 },
    { play: [{ card: bigDefender, exerted: true }] },
  );
  expect(
    g.asPlayerOne().playCard(pushingBoundaries, { targets: [triggerAttacker] }),
  ).toBeSuccessfulCommand();
  expect(g.asPlayerOne().challenge(triggerAttacker, bigDefender)).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getDamage(triggerAttacker)).toBe(0);
  expect(g.asPlayerTwo().getDamage(bigDefender)).toBe(2);
});

const readyAction = createMockAction({
  id: "boundaries-ready",
  name: "Ready",
  cost: 0,
  abilities: [{ type: "action", effect: { type: "ready", target: "CHOSEN_CHARACTER" } }],
});
const damageAction = createMockAction({
  id: "boundaries-damage",
  name: "Damage",
  cost: 0,
  abilities: [
    { type: "action", effect: { type: "deal-damage", amount: 1, target: "CHOSEN_CHARACTER" } },
  ],
});
const returnAction = createMockAction({
  id: "boundaries-return",
  name: "Return",
  cost: 0,
  abilities: [{ type: "action", effect: { type: "return-to-hand", target: "CHOSEN_CHARACTER" } }],
});
const ward = createMockCharacter({
  id: "boundaries-ward",
  name: "Ward",
  cost: 1,
  strength: 2,
  willpower: 8,
  abilities: [{ type: "keyword", keyword: "Ward" }],
});
const item = createMockItem({ id: "boundaries-item", name: "Item", cost: 1 });
const place = createMockLocation({ id: "boundaries-place", name: "Place", cost: 1 });

describe("Pushing Boundaries limits", () => {
  it("does not heal prior damage or prevent effect damage outside the challenge", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [pushingBoundaries, damageAction, damageAction],
        inkwell: 2,
        play: [{ card: ward, damage: 2, isDrying: false }],
      },
      { play: [{ card: bigDefender, exerted: true }] },
    );
    expect(
      g.asPlayerOne().playCard(pushingBoundaries, { targets: [ward] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(ward)).toBe(2);
    expect(g.asPlayerOne().playCard(damageAction, { targets: [ward] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(ward)).toBe(3);
    expect(g.asPlayerOne().challenge(ward, bigDefender)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(ward)).toBe(3);
    expect(g.asPlayerTwo().getDamage(bigDefender)).toBe(2);
    expect(g.asPlayerOne().playCard(damageAction, { targets: [ward] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(ward)).toBe(4);
  });
  it("protects each repeated challenge without generating extra drops", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [pushingBoundaries, readyAction],
        inkwell: 2,
        play: [{ card: ward, isDrying: false }],
      },
      { play: [{ card: bigDefender, exerted: true }] },
    );
    expect(
      g.asPlayerOne().playCard(pushingBoundaries, { targets: [ward] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().challenge(ward, bigDefender)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(readyAction, { targets: [ward] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().challenge(ward, bigDefender)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(ward)).toBe(0);
    expect(g.asPlayerTwo().getDamage(bigDefender)).toBe(4);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
  });
  it("does not grant Rush, readiness or quest restrictions", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [pushingBoundaries], inkwell: 2, play: [{ card: ward, isDrying: true }] },
      { play: [{ card: bigDefender, exerted: true }] },
    );
    expect(
      g.asPlayerOne().playCard(pushingBoundaries, { targets: [ward] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().challenge(ward, bigDefender).success).toBe(false);
    expect(g.asPlayerOne().quest(ward).success).toBe(false);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
  });
  it("expires before the opponent challenges the chosen character", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [pushingBoundaries], inkwell: 2, play: [{ card: ward, isDrying: false }] },
      { play: [{ card: bigDefender, isDrying: false }] },
    );
    expect(
      g.asPlayerOne().playCard(pushingBoundaries, { targets: [ward] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(ward)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().challenge(bigDefender, ward)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(ward)).toBe(5);
    expect(g.asPlayerTwo().getDamage(bigDefender)).toBe(2);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.getInkDrops(PLAYER_TWO)).toBe(0);
  });
  // CR 7.1.6: the same physical card becomes a new object after leaving play.
  it("player two loses protection after return and replay, even with Rush", () => {
    const rushWard = createMockCharacter({
      ...ward,
      id: "boundaries-rush-ward",
      abilities: [
        { type: "keyword", keyword: "Ward" },
        { type: "keyword", keyword: "Rush" },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: bigDefender, exerted: true }], deck: 6 },
      { hand: [pushingBoundaries, returnAction], inkwell: 3, play: [rushWard], deck: 6 },
    );
    const target = g.findCardInstanceId(rushWard, "play", PLAYER_TWO);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(pushingBoundaries)).toBeSuccessfulCommand();
    const [pending] = g.asPlayerTwo().getPendingEffects();
    if (pending?.selectionContext?.kind !== "target-selection") throw new Error("Expected choice");
    expect(pending.selectionContext.cardCandidateIds).toEqual([target]);
    expect(g.asPlayerOne().resolveNextPending({ targets: [target] })).not.toBeSuccessfulCommand();
    expect(g.asPlayerTwo().resolveNextPending({ targets: [target] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().challenge(target, bigDefender)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(target)).toBe(0);
    expect(g.asPlayerOne().getDamage(bigDefender)).toBe(2);
    expect(g.asPlayerTwo().playCard(returnAction, { targets: [target] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(target)).toBe("hand");
    expect(g.asPlayerTwo().playCard(target)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().challenge(target, bigDefender)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(target)).toBe(5);
    expect(g.asPlayerOne().getDamage(bigDefender)).toBe(4);
    expect(g.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
  });
  for (const invalid of ["opponent", "item", "location", "hand", "discard", "multiple"])
    it("rejects " + invalid + " without payment, then accepts own Ward", () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [pushingBoundaries, attacker],
          inkwell: 2,
          play: [ward, item, place],
          discard: [triggerAttacker],
        },
        { play: [bigDefender] },
      );
      const targets =
        invalid === "opponent"
          ? [bigDefender]
          : invalid === "item"
            ? [item]
            : invalid === "location"
              ? [place]
              : invalid === "hand"
                ? [attacker]
                : invalid === "discard"
                  ? [triggerAttacker]
                  : [ward, item];
      expect(g.asPlayerOne().playCard(pushingBoundaries, { targets }).success).toBe(false);
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
      expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
      expect(g.asPlayerOne().getCardZone(pushingBoundaries)).toBe("hand");
      expect(
        g.asPlayerOne().playCard(pushingBoundaries, { targets: [ward] }),
      ).toBeSuccessfulCommand();
      expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    });
  it("still gains one drop with no own character", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [pushingBoundaries], inkwell: 2, play: [item, place] },
      { play: [bigDefender] },
    );
    expect(g.asPlayerOne().playCard(pushingBoundaries)).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne()).toHavePendingEffectCount(0);
    expect(g.asPlayerOne().getCardZone(pushingBoundaries)).toBe("discard");
  });
  it("can spend an existing drop and gains exactly one new drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [pushingBoundaries],
      inkwell: 1,
      inkDrops: 1,
      play: [ward],
    });
    expect(
      g.asPlayerOne().playCard(pushingBoundaries, { targets: [ward], inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });
  it("cannot spend the drop it would generate to pay its own cost", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [pushingBoundaries],
      inkwell: 1,
      play: [ward],
    });
    expect(
      g.asPlayerOne().playCard(pushingBoundaries, { targets: [ward], inkDrops: 1 }).success,
    ).toBe(false);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
  });
  it("is uninkable", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [pushingBoundaries] });
    expect(g.asPlayerOne().putIntoInkwell(PLAYER_ONE, pushingBoundaries).success).toBe(false);
    expect(g.asPlayerOne().getCardZone(pushingBoundaries)).toBe("hand");
  });
});

// A chosen self-damage trigger in the post-combat bag remains inside the challenge.
it("prevents chosen effect damage until challenge banishment triggers finish", () => {
  const scout = createMockCharacter({
    id: "boundaries-scout",
    name: "Scout",
    cost: 6,
    strength: 4,
    willpower: 5,
    abilities: [
      { type: "keyword", keyword: "Resist", value: 1 },
      {
        type: "triggered",
        name: "SCOUT LEADER",
        trigger: { event: "banish-in-challenge", on: "SELF", timing: "whenever" },
        effect: {
          type: "optional",
          chooser: "CONTROLLER",
          effect: {
            type: "deal-damage",
            amount: 2,
            target: "CHOSEN_CHARACTER",
          },
        },
      },
    ],
  });
  const victim = createMockCharacter({
    id: "boundaries-victim",
    name: "Victim",
    cost: 3,
    strength: 3,
    willpower: 3,
  });
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [{ card: victim, exerted: true }], deck: 6 },
    { play: [{ card: scout, damage: 1 }], hand: [pushingBoundaries], inkwell: 2, deck: 6 },
  );
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().playCard(pushingBoundaries, { targets: [scout] })).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().challenge(scout, victim)).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardZone(victim)).toBe("discard");
  expect(g.asPlayerTwo().getDamage(scout)).toBe(1);
  expect(g.asPlayerTwo().getBagCount()).toBe(1);
  expect(
    g.asPlayerOne().resolvePendingByCard(scout, { resolveOptional: true, targets: [scout] }),
  ).not.toBeSuccessfulCommand();
  expect(
    g.asPlayerTwo().resolvePendingByCard(scout, { resolveOptional: true, targets: [scout] }),
  ).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().getDamage(scout)).toBe(1);
  expect(g.asPlayerTwo().getBagCount()).toBe(0);
  expect(g.getInkDrops(PLAYER_TWO)).toBe(1);
});

it("player two gets and can spend the drop without a legal character in play", () => {
  const filler = createMockCharacter({ id: "boundaries-hidden", name: "Hidden", cost: 1 });
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [bigDefender, ward], deck: 6 },
    {
      play: [item, place],
      hand: [pushingBoundaries, filler],
      discard: [ward],
      inkwell: 2,
      deck: [filler, filler, filler],
    },
  );
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().playCard(pushingBoundaries)).toBeSuccessfulCommand();
  expect(g.asPlayerTwo()).toHavePendingEffectCount(0);
  expect(g.asPlayerTwo().getBagCount()).toBe(0);
  expect(g.asPlayerTwo().getCardZone(pushingBoundaries)).toBe("discard");
  expect(g.getInkDrops(PLAYER_TWO)).toBe(1);
  expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(g.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(g.asPlayerTwo().playCard(filler, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(g.getInkDrops(PLAYER_TWO)).toBe(0);
});
