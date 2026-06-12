import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import {
  heiheiBoatSnack,
  liloMakingAWish,
  tinkerBellGiantFairy,
  teKHeartless,
  starkeyHooksHenchman,
} from "@tcg/lorcana-cards/cards/001";
import { mushuMajesticDragon, yzmaAboveItAll } from "@tcg/lorcana-cards/cards/007";

const weakDefender = createMockCharacter({
  id: "banish-test-weak-defender",
  name: "Weak Defender",
  cost: 2,
  strength: 1,
  willpower: 2,
});

describe("PUNY PIRATE! - During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.", () => {
  it("It should trigger when this character banishes another character in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [tinkerBellGiantFairy],
      },
      {
        play: [
          { card: heiheiBoatSnack, exerted: true },
          { card: liloMakingAWish, exerted: true },
        ],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(tinkerBellGiantFairy, heiheiBoatSnack),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(heiheiBoatSnack).zone).toEqual("discard");

    // Puny Pirate! should trigger, giving us a bag to resolve
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          targets: [liloMakingAWish],
        }),
    ).toBeSuccessfulCommand();

    // Lilo (1wp) should be banished by 2 damage
    expect(testEngine.asPlayerOne().getCard(liloMakingAWish).zone).toEqual("discard");
  });

  it("It should not trigger again when the character is banished by a trigger damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [tinkerBellGiantFairy],
      },
      {
        play: [
          { card: heiheiBoatSnack, exerted: true },
          { card: teKHeartless, exerted: true },
          { card: liloMakingAWish, exerted: true },
        ],
      },
    );

    expect(
      // Banish in a challenge
      testEngine.asPlayerOne().challenge(tinkerBellGiantFairy, heiheiBoatSnack),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(heiheiBoatSnack).zone).toEqual("discard");

    expect(
      // Banish by an effect
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          targets: [liloMakingAWish],
        }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(liloMakingAWish).zone).toEqual("discard");

    // Given Lilo was not banished in a challenge it should not create another trigger
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("It should not trigger when another character is is the one banishing on challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [tinkerBellGiantFairy, teKHeartless],
      },
      {
        play: [
          { card: heiheiBoatSnack, exerted: true },
          { card: liloMakingAWish, exerted: true },
        ],
      },
    );

    expect(
      // Banish in a challenge, but it's not Tinker Bell
      testEngine.asPlayerOne().challenge(teKHeartless, heiheiBoatSnack),
    ).toBeSuccessfulCommand();

    // Teka Banished in a challenge so the effect should not trigger.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("It should not during opponent's turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [heiheiBoatSnack, liloMakingAWish],
      },
      {
        play: [{ card: tinkerBellGiantFairy, exerted: true }],
      },
    );

    expect(
      // HeiHei is banished in a challenge.
      testEngine.asPlayerOne().challenge(heiheiBoatSnack, tinkerBellGiantFairy),
    ).toBeSuccessfulCommand();

    // It should not trigger and it isn't Tinker bell's owner turn.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("It should trigger even when both characters banish each other (mutual kill)", () => {
    // Tinker Bell (4str/5wp) vs Starkey (5str/4wp) - both take lethal damage
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [tinkerBellGiantFairy, teKHeartless],
      },
      {
        // liloMakingAWish provides a valid target for the "deal 2 damage to chosen opposing character" effect
        play: [{ card: starkeyHooksHenchman, exerted: true }, liloMakingAWish],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(tinkerBellGiantFairy, starkeyHooksHenchman),
    ).toBeSuccessfulCommand();

    // Both characters should be banished
    expect(testEngine.asPlayerOne().getCard(tinkerBellGiantFairy).zone).toEqual("discard");
    expect(testEngine.asPlayerOne().getCard(starkeyHooksHenchman).zone).toEqual("discard");

    // Tinker Bell banished Starkey in a challenge, so the trigger should still fire
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
  });
});

describe("GUARDIAN OF LOST SOULS - During your turn, whenever one of your characters banishes another character in a challenge, gain 2 lore.", () => {
  it("It should trigger when any of your characters banishes in a challenge", () => {
    // Mushu uses on: "YOUR_CHARACTERS" so any of player one's characters can trigger it
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [mushuMajesticDragon, starkeyHooksHenchman],
        lore: 0,
      },
      {
        play: [{ card: weakDefender, exerted: true }],
      },
    );

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

    expect(
      // Starkey banishes weak defender, not Mushu himself
      testEngine.asPlayerOne().challenge(starkeyHooksHenchman, weakDefender),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(weakDefender)).toBe("discard");

    // Mushu's trigger should fire (gain 2 lore) even though Starkey did the banishing
    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
  });
});

describe("BACK TO WORK - Whenever another character is banished in a challenge, return that card to its player's hand, then that player discards a card at random.", () => {
  it("It should trigger when another character is banished in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [yzmaAboveItAll, starkeyHooksHenchman],
        deck: 2,
      },
      {
        play: [{ card: weakDefender, exerted: true }],
        hand: [liloMakingAWish],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(starkeyHooksHenchman, weakDefender),
    ).toBeSuccessfulCommand();

    // Yzma's BACK TO WORK auto-resolves: defender returned to hand, then opponent discards 1 at random
    // After the sequence: 1 card remains in hand, 1 in discard
    expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(1);
    expect(testEngine.asPlayerTwo().getZonesCardCount().discard).toBe(1);
  });

  it("It should trigger even during opponent's turn (no turn restriction)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [starkeyHooksHenchman],
        hand: [liloMakingAWish],
        deck: 2,
      },
      {
        play: [yzmaAboveItAll, { card: weakDefender, exerted: true }],
        deck: 2,
      },
    );

    expect(
      // Player one banishes player two's weak defender during player one's turn
      testEngine.asPlayerOne().challenge(starkeyHooksHenchman, weakDefender),
    ).toBeSuccessfulCommand();

    // Yzma belongs to player two but BACK TO WORK has no turn restriction
    // The defender should be returned to player two's hand, then player two discards 1 at random
    expect(testEngine.asPlayerTwo().getZonesCardCount().discard).toBe(1);
  });

  it("It should not trigger when Yzma herself is the one banished in a challenge", () => {
    // Need Evasive to challenge Yzma (who has Evasive)
    const strongEvasiveAttacker = createMockCharacter({
      id: "banish-test-strong-evasive",
      name: "Strong Evasive Attacker",
      cost: 5,
      strength: 10,
      willpower: 10,
      abilities: [
        {
          id: "banish-test-strong-evasive-evasive",
          keyword: "Evasive",
          text: "Evasive",
          type: "keyword",
        },
      ],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: yzmaAboveItAll, exerted: true }],
        deck: 2,
      },
      {
        play: [strongEvasiveAttacker],
        deck: 2,
      },
    );

    // Pass to opponent's turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent challenges exerted Yzma (strength 10 vs willpower 8 — Yzma is banished)
    expect(
      testEngine.asPlayerTwo().challenge(strongEvasiveAttacker, yzmaAboveItAll),
    ).toBeSuccessfulCommand();

    // Yzma is banished
    expect(testEngine.asPlayerOne().getCardZone(yzmaAboveItAll)).toBe("discard");

    // BACK TO WORK should NOT trigger since Yzma herself was banished, not "another character"
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
  });
});
