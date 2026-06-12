import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "../../../testing";

const challengeLoreWatcher = createMockCharacter({
  id: "challenge-lore-watcher",
  name: "Challenge Lore Watcher",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  abilities: [
    {
      id: "challenge-lore-watcher-1",
      text: "Whenever this character challenges, gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
  ],
});

const banishInChallengeWatcher = createMockCharacter({
  id: "banish-in-challenge-watcher",
  name: "Banish In Challenge Watcher",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  abilities: [
    {
      id: "banish-in-challenge-watcher-1",
      text: "Whenever one of your characters banishes another character in a challenge, gain 2 lore.",
      type: "triggered",
      trigger: {
        event: "banish-in-challenge",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      effect: {
        amount: 2,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
  ],
});

const fragileDefender = createMockCharacter({
  id: "fragile-defender",
  name: "Fragile Defender",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const stickyAttacker = createMockCharacter({
  id: "sticky-attacker",
  name: "Sticky Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  abilities: [
    {
      id: "sticky-attacker-1",
      text: "When this character is banished in a challenge, return this card to your hand.",
      type: "triggered",
      sourceZones: ["play", "discard"],
      trigger: {
        event: "banish",
        on: "SELF",
        restrictions: [{ type: "in-challenge" }],
        timing: "when",
      },
      effect: {
        target: { ref: "self" },
        type: "return-to-hand",
      },
    },
  ],
});

const spitefulDefender = createMockCharacter({
  id: "spiteful-defender",
  name: "Spiteful Defender",
  cost: 2,
  strength: 0,
  willpower: 1,
  lore: 1,
  abilities: [
    {
      id: "spiteful-defender-1",
      text: "When this character is challenged and banished, banish the challenging character.",
      type: "triggered",
      sourceZones: ["play", "discard"],
      trigger: {
        event: "challenged-and-banished",
        on: "SELF",
        timing: "when",
      },
      effect: {
        target: { ref: "attacker" },
        type: "banish",
      },
    },
  ],
});

const redirectingGuardian = createMockCharacter({
  id: "redirecting-guardian",
  name: "Redirecting Guardian",
  cost: 2,
  strength: 0,
  willpower: 1,
  lore: 1,
  abilities: [
    {
      id: "redirecting-guardian-1",
      text: "Whenever one of your other characters would be dealt damage, put that many damage counters on this character instead.",
      type: "replacement",
      replaces: "damage-to-character",
      replacement: {
        type: "redirect-damage",
        appliesTo: "your-other-characters",
        redirectTo: "self",
      },
    },
  ],
});

const discardChallengeWatcher = createMockCharacter({
  id: "discard-challenge-watcher",
  name: "Discard Challenge Watcher",
  cost: 2,
  lore: 1,
  abilities: [
    {
      id: "discard-challenge-watcher-1",
      text: "While this is in your discard, whenever one of your characters banishes another character in a challenge, gain 3 lore.",
      type: "triggered",
      sourceZones: ["discard"],
      trigger: {
        event: "banish-in-challenge",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      effect: {
        amount: 3,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
  ],
});

describe("challenge trigger windows", () => {
  it("holds challenge damage until declaration-window bag effects auto-resolve", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [challengeLoreWatcher],
        deck: 1,
      },
      {
        play: [{ card: fragileDefender, exerted: true }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().challenge(challengeLoreWatcher, fragileDefender).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerOne().getCardZone(fragileDefender)).toBe("discard");
    expect(
      testEngine
        .getServerEngine()
        .getRuntime()
        .getMoveLogHistory()
        .some((log) => log.moveType === "challenge"),
    ).toBe(true);
  });

  it("queues banish-in-challenge triggers only after challenge damage is complete", () => {
    const attacker = createMockCharacter({
      id: "banishing-attacker",
      name: "Banishing Attacker",
      cost: 2,
      strength: 3,
      willpower: 3,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [attacker, banishInChallengeWatcher],
        deck: 1,
      },
      {
        play: [{ card: fragileDefender, exerted: true }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().challenge(attacker, fragileDefender).success).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(fragileDefender)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
  });

  it("does not scan unrelated discard triggers during the after-challenge window", () => {
    const attacker = createMockCharacter({
      id: "after-challenge-window-attacker",
      name: "After Challenge Window Attacker",
      cost: 2,
      strength: 3,
      willpower: 3,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [attacker],
        discard: [discardChallengeWatcher],
        deck: 1,
      },
      {
        play: [{ card: fragileDefender, exerted: true }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().challenge(attacker, fragileDefender).success).toBe(true);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("keeps the challenge open while post-damage bag effects create more post-damage bag effects", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [stickyAttacker],
        deck: 1,
      },
      {
        play: [{ card: spitefulDefender, exerted: true }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().challenge(stickyAttacker, spitefulDefender).success).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(spitefulDefender)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne()).toHavePriorityPlayer(PLAYER_TWO);
    expect(testEngine.getAuthoritativeState().G.challengeState?.stage).toBe("post-damage");

    const [firstBagEffect] = testEngine.asPlayerTwo().getBagEffects();
    expect(testEngine.asPlayerTwo().resolvePendingByCard(firstBagEffect!.sourceId).success).toBe(
      true,
    );

    expect(testEngine.asPlayerOne().getCardZone(stickyAttacker)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne()).toHavePriorityPlayer(PLAYER_ONE);
    expect(testEngine.getAuthoritativeState().G.challengeState?.stage).toBe("post-damage");

    const [secondBagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolvePendingByCard(secondBagEffect!.sourceId).success).toBe(
      true,
    );

    expect(testEngine.asPlayerOne().getCardZone(stickyAttacker)).toBe("hand");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.getAuthoritativeState().G.challengeState).toBeUndefined();
  });

  it("does not emit challenged-and-banished when challenge damage is redirected off the defender", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [stickyAttacker],
        deck: 1,
      },
      {
        play: [
          { card: spitefulDefender, exerted: true },
          { card: redirectingGuardian, exerted: false },
        ],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().challenge(stickyAttacker, spitefulDefender).success).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(spitefulDefender)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(redirectingGuardian)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(stickyAttacker)).toBe("play");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.getAuthoritativeState().G.challengeState).toBeUndefined();
  });

  it("treats negative strength as 0 for challenge damage", () => {
    const weakenedDefender = createMockCharacter({
      id: "weakened-defender",
      name: "Weakened Defender",
      cost: 2,
      strength: 1,
      willpower: 2,
      lore: 1,
      abilities: [
        {
          id: "weakened-defender-1",
          type: "static",
          text: "This character gets -2 strength.",
          effect: {
            type: "modify-stat",
            stat: "strength",
            modifier: -2,
            target: "SELF",
          },
        },
      ],
    });
    const attacker = createMockCharacter({
      id: "challenge-attacker",
      name: "Challenge Attacker",
      cost: 2,
      strength: 3,
      willpower: 3,
      lore: 1,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [attacker],
      },
      {
        play: [{ card: weakenedDefender, exerted: true, isDrying: false }],
      },
    );

    expect(testEngine.asPlayerOne().challenge(attacker, weakenedDefender).success).toBe(true);
    expect(testEngine.asPlayerOne().getCard(attacker).damage).toBe(0);
  });
});
