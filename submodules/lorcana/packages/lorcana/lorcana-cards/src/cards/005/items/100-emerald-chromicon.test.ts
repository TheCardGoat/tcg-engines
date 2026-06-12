import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { emeraldChromicon } from "./100-emerald-chromicon";

const fragileAlly = createMockCharacter({
  id: "emerald-chromicon-fragile-ally",
  name: "Fragile Ally",
  cost: 2,
  strength: 1,
  willpower: 1,
});

const secondFragileAlly = createMockCharacter({
  id: "emerald-chromicon-fragile-ally-2",
  name: "Second Fragile Ally",
  cost: 2,
  strength: 1,
  willpower: 1,
});

const thirdFragileAlly = createMockCharacter({
  id: "emerald-chromicon-fragile-ally-3",
  name: "Third Fragile Ally",
  cost: 2,
  strength: 1,
  willpower: 1,
});

const opposingAttacker = createMockCharacter({
  id: "emerald-chromicon-opposing-attacker",
  name: "Opposing Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
});

const retreatingTarget = createMockCharacter({
  id: "emerald-chromicon-retreating-target",
  name: "Retreating Target",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const steadfastDefender = createMockCharacter({
  id: "emerald-chromicon-steadfast-defender",
  name: "Steadfast Defender",
  cost: 4,
  strength: 4,
  willpower: 4,
});

// A character whose on-play effect banishes all opposing characters with 1 willpower or less
const massBanisher = createMockCharacter({
  id: "emerald-chromicon-mass-banisher",
  name: "Mass Banisher",
  cost: 3,
  strength: 3,
  willpower: 3,
  abilities: [
    {
      id: "mass-banisher-1",
      text: "When you play this character, banish all opposing characters with 1 willpower or less.",
      type: "triggered" as const,
      trigger: {
        event: "play" as const,
        on: "SELF" as const,
        timing: "when" as const,
      },
      effect: {
        type: "banish" as const,
        target: {
          selector: "all" as const,
          count: "all" as const,
          owner: "opponent" as const,
          zones: ["play"] as const,
          cardTypes: ["character"] as const,
        },
      },
    },
  ],
});

describe("Emerald Chromicon", () => {
  it("can return a chosen character to its player's hand when one of your characters is banished during an opponent's turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
        play: [emeraldChromicon, { card: fragileAlly, exerted: true }],
      },
      {
        deck: 1,
        play: [opposingAttacker, retreatingTarget],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(opposingAttacker, fragileAlly),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(emeraldChromicon, {
        resolveOptional: true,
        targets: [retreatingTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(retreatingTarget)).toBe("hand");
  });

  it("does not trigger when your character is banished on your own turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
        play: [emeraldChromicon, fragileAlly],
      },
      {
        deck: 1,
        play: [{ card: steadfastDefender, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(fragileAlly, steadfastDefender),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("allows declining the optional trigger without returning any character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
        play: [emeraldChromicon, { card: fragileAlly, exerted: true }],
      },
      {
        deck: 1,
        play: [opposingAttacker, retreatingTarget],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(opposingAttacker, fragileAlly),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Decline the optional ability
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(emeraldChromicon, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    // Retreating target should still be in play
    expect(testEngine.asPlayerTwo().getCardZone(retreatingTarget)).toBe("play");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("does not trigger when a character is returned to hand rather than banished", () => {
    // A character with an ability that returns an opposing character to hand
    const bouncer = createMockCharacter({
      id: "emerald-chromicon-bouncer",
      name: "Bouncer",
      cost: 3,
      strength: 2,
      willpower: 2,
      abilities: [
        {
          id: "bouncer-1",
          text: "When you play this character, return chosen opposing character to their player's hand.",
          type: "triggered" as const,
          trigger: {
            event: "play" as const,
            on: "SELF" as const,
            timing: "when" as const,
          },
          effect: {
            type: "return-to-hand" as const,
            target: {
              selector: "chosen" as const,
              count: 1,
              owner: "opponent" as const,
              zones: ["play"] as const,
              cardTypes: ["character"] as const,
            },
          },
        },
      ],
    });

    const bounceTarget = createMockCharacter({
      id: "emerald-chromicon-bounce-target",
      name: "Bounce Target",
      cost: 2,
      strength: 2,
      willpower: 2,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
        play: [emeraldChromicon, bounceTarget],
      },
      {
        deck: 1,
        hand: [bouncer],
        inkwell: bouncer.cost,
      },
    );

    // Pass to opponent's turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent plays bouncer, which has a triggered ability to return a character to hand
    expect(testEngine.asPlayerTwo().playCard(bouncer)).toBeSuccessfulCommand();

    // The bouncer's ETB trigger is in the bag for player two to resolve
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
    const [bouncerBag] = testEngine.asPlayerTwo().getBagEffects();
    expect(
      testEngine.asPlayerTwo().resolveBag(bouncerBag!.id, {
        targets: [bounceTarget],
      }),
    ).toBeSuccessfulCommand();

    // The bounce target should be in player one's hand
    expect(testEngine.asPlayerOne().getCardZone(bounceTarget)).toBe("hand");

    // Emerald Chromicon should NOT trigger because this was a return-to-hand, not a banish
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("does not trigger when a character is banished by self-damage at end of own turn", () => {
    // A character that deals 1 damage to itself at end of your turn
    const selfDamager = createMockCharacter({
      id: "emerald-chromicon-self-damager",
      name: "Self Damager",
      cost: 2,
      strength: 3,
      willpower: 2,
      abilities: [
        {
          id: "self-damager-1",
          text: "At the end of your turn, deal 1 damage to this character.",
          type: "triggered" as const,
          trigger: {
            event: "end-turn" as const,
            on: "YOU" as const,
            timing: "at" as const,
          },
          effect: {
            type: "deal-damage" as const,
            amount: 1,
            target: "SELF" as const,
          },
        },
      ],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
        play: [emeraldChromicon, selfDamager],
      },
      {
        deck: 1,
      },
    );

    // Set self-damager to 1 damage already (willpower 2, so 1 more will banish)
    testEngine.asServer().manualSetDamage(selfDamager, 1);

    // Pass turn - end of turn trigger fires, dealing 1 more damage and banishing
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Self damager should be banished
    expect(testEngine.asPlayerOne().getCardZone(selfDamager)).toBe("discard");

    // Emerald Chromicon should NOT trigger since this happened on our own turn
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("triggers once per banished character when multiple characters are banished at once", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
        play: [emeraldChromicon, fragileAlly, secondFragileAlly, thirdFragileAlly],
      },
      {
        deck: 1,
        hand: [massBanisher],
        inkwell: massBanisher.cost,
      },
    );

    // Pass to opponent's turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent plays mass banisher, which banishes all 3 fragile allies
    expect(testEngine.asPlayerTwo().playCard(massBanisher)).toBeSuccessfulCommand();

    // All three fragile allies should be banished
    expect(testEngine.asPlayerOne().getCardZone(fragileAlly)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(secondFragileAlly)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(thirdFragileAlly)).toBe("discard");

    // Emerald Chromicon should trigger 3 times (once per banished character)
    expect(testEngine.asPlayerOne().getBagCount()).toBe(3);

    // Resolve first trigger: return mass banisher to opponent's hand
    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolveBag(bagEffects[0]!.id, {
        resolveOptional: true,
        targets: [massBanisher],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(massBanisher)).toBe("hand");

    // The remaining optional entries have no legal target and auto-drain.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("can accept the optional trigger even when no valid characters remain in play", () => {
    // Only one character in play (the fragile ally) - after it's banished,
    // there are no characters left to target for return-to-hand
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
        play: [emeraldChromicon, { card: fragileAlly, exerted: true }],
      },
      {
        deck: 1,
        play: [opposingAttacker],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(opposingAttacker, fragileAlly),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Accept the optional trigger - but there's no valid target
    // The ability should still resolve without error, it just has no effect
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(emeraldChromicon, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
