import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import type { CharacterCard } from "@tcg/lorcana-types";
import {
  createMockAction,
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend } from "../../001";
import { plasmaBlaster } from "../../001/items/204-plasma-blaster";
import { dragonFire } from "../../010/actions/133-dragon-fire";
import { begone } from "../../010/actions/061-begone";
import { ragingStorm } from "../actions/028-raging-storm";
import { strengthOfARagingFire } from "../../002/actions/201-strength-of-a-raging-fire";
import { goliathClanLeader } from "../../010/characters/173-goliath-clan-leader";
import { johnSmithUndauntedProtector } from "./193-john-smith-undaunted-protector";

const johnSmithWithWard: CharacterCard = {
  ...johnSmithUndauntedProtector,
  id: "h1O-ward",
  canonicalId: "ci_h1O_ward",
  abilities: [
    ...(johnSmithUndauntedProtector.abilities ?? []),
    {
      id: "h1O-ward-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
  ],
};

describe("John Smith - Undaunted Protector", () => {
  it("has Bodyguard", () => {
    const testEngine = new LorcanaTestEngine({
      play: [johnSmithUndauntedProtector],
    });

    expect(testEngine.getCardModel(johnSmithUndauntedProtector).hasBodyguard()).toBe(true);
  });

  it("forces opponents to target him with action cards if able", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [dragonFire],
        inkwell: dragonFire.cost,
      },
      {
        play: [johnSmithUndauntedProtector, mickeyMouseTrueFriend],
      },
    );

    const rejectedResult = testEngine.asPlayerOne().playCard(dragonFire, {
      targets: [mickeyMouseTrueFriend],
    }) as CommandFailure;

    expect(rejectedResult.success).toBe(false);
    expect(rejectedResult.errorCode).toBe("TARGET_DO_YOUR_WORST_RESTRICTION");
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("play");

    expect(
      testEngine.asPlayerOne().playCard(dragonFire, {
        targets: [johnSmithUndauntedProtector],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(johnSmithUndauntedProtector)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("play");
  });

  it("forces opponents to target him with activated abilities if able", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [plasmaBlaster],
        inkwell: 2,
      },
      {
        play: [johnSmithUndauntedProtector, mickeyMouseTrueFriend],
      },
    );

    const rejectedResult = testEngine.asPlayerOne().activateAbility(plasmaBlaster, {
      targets: [mickeyMouseTrueFriend],
    }) as CommandFailure;

    expect(rejectedResult.success).toBe(false);
    expect(rejectedResult.errorCode).toBe("TARGET_DO_YOUR_WORST_RESTRICTION");
    expect(testEngine.asPlayerTwo().getDamage(mickeyMouseTrueFriend)).toBe(0);

    expect(
      testEngine.asPlayerOne().activateAbility(plasmaBlaster, {
        targets: [johnSmithUndauntedProtector],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getDamage(johnSmithUndauntedProtector)).toBe(1);
  });

  it("allows choosing either John Smith when multiple are in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [dragonFire],
        inkwell: dragonFire.cost,
      },
      {
        play: [johnSmithUndauntedProtector, johnSmithUndauntedProtector, mickeyMouseTrueFriend],
      },
    );

    const johnSmithIds = testEngine
      .getCardInstanceIdsInZone("play", PLAYER_TWO)
      .filter(
        (cardId) => testEngine.getCardDefinitionId(cardId) === johnSmithUndauntedProtector.id,
      );

    expect(
      testEngine.asPlayerOne().playCard(dragonFire, {
        targets: [johnSmithIds[0]!],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("play");
  });

  it("does not affect the card owner's own targeting choices", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [dragonFire],
      inkwell: dragonFire.cost,
      play: [johnSmithUndauntedProtector, mickeyMouseTrueFriend],
    });

    expect(
      testEngine.asPlayerOne().playCard(dragonFire, {
        targets: [mickeyMouseTrueFriend],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseTrueFriend)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(johnSmithUndauntedProtector)).toBe("play");
  });

  it("does not affect non-chosen effects", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [ragingStorm],
        inkwell: ragingStorm.cost,
      },
      {
        play: [johnSmithUndauntedProtector, mickeyMouseTrueFriend],
      },
    );

    expect(testEngine.asPlayerOne().playCard(ragingStorm)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(johnSmithUndauntedProtector)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("discard");
  });

  // Regression: John Smith's DO YOUR WORST was not preventing Strength of a Raging Fire
  // from targeting Goliath - Clan Leader when John Smith was in play (fixed Feb 23)
  it("regression: prevents Strength of a Raging Fire from targeting Goliath when John Smith is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [strengthOfARagingFire],
        inkwell: strengthOfARagingFire.cost,
        play: [mickeyMouseTrueFriend, goliathClanLeader],
      },
      {
        play: [johnSmithUndauntedProtector, goliathClanLeader],
      },
    );

    // Attempting to target opponent's Goliath should fail because John Smith must be chosen
    const rejectedResult = testEngine.asPlayerOne().playCard(strengthOfARagingFire, {
      targets: [testEngine.findCardInstanceId(goliathClanLeader, "play", PLAYER_TWO)],
    }) as CommandFailure;

    expect(rejectedResult.success).toBe(false);
    expect(rejectedResult.errorCode).toBe("TARGET_DO_YOUR_WORST_RESTRICTION");

    // Targeting John Smith should succeed
    expect(
      testEngine.asPlayerOne().playCard(strengthOfARagingFire, {
        targets: [johnSmithUndauntedProtector],
      }),
    ).toBeSuccessfulCommand();
  });

  it("allows other targets when John Smith has Ward and is not legal", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [plasmaBlaster],
        inkwell: 2,
      },
      {
        play: [johnSmithWithWard, mickeyMouseTrueFriend],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(plasmaBlaster, {
        targets: [mickeyMouseTrueFriend],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getDamage(mickeyMouseTrueFriend)).toBe(1);
    expect(testEngine.asPlayerTwo().getDamage(johnSmithWithWard)).toBe(0);
  });

  // Wilds Unknown release notes — rules 6.1.3 and 6.7.3:
  //   The "choose" instruction in an ability's text is the requirement.
  //   Anything that restricts the choice pool (e.g. "with X strength or less") is a limiter.
  //   DO YOUR WORST forces opponents to choose John Smith *if able* — i.e., only when
  //   he satisfies both the requirement AND any limiter.
  describe("release notes ruling — requirement vs limiter", () => {
    it("satisfies an unrestricted 'chosen character' requirement: opponent is forced to target John Smith", () => {
      // dragonFire: "Banish chosen character." — no limiter, both characters legal.
      // John Smith must be chosen due to DO YOUR WORST.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
        },
        {
          play: [johnSmithUndauntedProtector, mickeyMouseTrueFriend],
        },
      );

      const rejected = testEngine.asPlayerOne().playCard(dragonFire, {
        targets: [mickeyMouseTrueFriend],
      }) as CommandFailure;
      expect(rejected.success).toBe(false);
      expect(rejected.errorCode).toBe("TARGET_DO_YOUR_WORST_RESTRICTION");

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [johnSmithUndauntedProtector],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(johnSmithUndauntedProtector)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("play");
    });

    it("limiter excludes John Smith (cost 5 vs cost 3 or less): opponent freely chooses another character", () => {
      // Begone!: "Return chosen character, item, or location with cost 3 or less to their player's hand."
      // John Smith costs 5 — not a legal target. The "if able" clause means John Smith is NOT able,
      // so DO YOUR WORST does not constrain the choice. Opponent may target Mickey freely.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [begone],
          inkwell: begone.cost,
        },
        {
          play: [johnSmithUndauntedProtector, mickeyMouseTrueFriend],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(begone, {
          targets: [mickeyMouseTrueFriend],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("hand");
      expect(testEngine.asPlayerTwo().getCardZone(johnSmithUndauntedProtector)).toBe("play");
    });

    it("limiter includes John Smith (strength 3 vs strength 3 or less): opponent must choose John Smith", () => {
      // Mock action: "Banish chosen character with 3 strength or less."
      // John Smith (strength 3) and Mickey True Friend (strength 3) both satisfy the limiter.
      // DO YOUR WORST applies because John Smith is "able", so opponent must choose him.
      const banishStrengthThreeOrLess = createMockAction({
        id: "do-your-worst-strength-limiter-action",
        name: "Test Strength Limiter",
        cost: 3,
        text: "Banish chosen character with 3 {S} or less.",
        abilities: [
          {
            id: "do-your-worst-strength-limiter-action-1",
            type: "action",
            text: "Banish chosen character with 3 {S} or less.",
            effect: {
              type: "banish",
              target: {
                cardTypes: ["character"],
                count: 1,
                filter: [
                  {
                    type: "strength-comparison",
                    comparison: "less-or-equal",
                    value: 3,
                  },
                ],
                owner: "any",
                selector: "chosen",
                zones: ["play"],
              },
            },
          },
        ],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [banishStrengthThreeOrLess],
          inkwell: banishStrengthThreeOrLess.cost,
        },
        {
          play: [johnSmithUndauntedProtector, mickeyMouseTrueFriend],
        },
      );

      const rejected = testEngine.asPlayerOne().playCard(banishStrengthThreeOrLess, {
        targets: [mickeyMouseTrueFriend],
      }) as CommandFailure;
      expect(rejected.success).toBe(false);
      expect(rejected.errorCode).toBe("TARGET_DO_YOUR_WORST_RESTRICTION");

      expect(
        testEngine.asPlayerOne().playCard(banishStrengthThreeOrLess, {
          targets: [johnSmithUndauntedProtector],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(johnSmithUndauntedProtector)).toBe("discard");
    });
  });
});
