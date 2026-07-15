import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { liloMakingAWish, simbaProtectiveCub, teKTheBurningOne } from "../characters";
import { soMuchToGive } from "../../007/actions/038-so-much-to-give";
import { musketeerTabard } from "./203-musketeer-tabard";

describe("Musketeer Tabard", () => {
  it("lets you draw a card when one of your Bodyguard characters is banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [musketeerTabard, simbaProtectiveCub],
      },
      {
        deck: 1,
        play: [{ card: teKTheBurningOne, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(simbaProtectiveCub, teKTheBurningOne),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(musketeerTabard, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(1);
  });

  it("does not trigger when one of your non-Bodyguard characters is banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [musketeerTabard, liloMakingAWish],
      },
      {
        deck: 1,
        play: [{ card: teKTheBurningOne, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(liloMakingAWish, teKTheBurningOne),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(liloMakingAWish)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(2);
  });

  it("triggers when one of your characters that gained Bodyguard is banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [soMuchToGive],
        inkwell: soMuchToGive.cost,
        deck: [simbaProtectiveCub, simbaProtectiveCub, simbaProtectiveCub],
        play: [musketeerTabard, liloMakingAWish],
      },
      {
        deck: 1,
        play: [{ card: teKTheBurningOne, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(soMuchToGive, {
        targets: [liloMakingAWish],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.hasKeyword(liloMakingAWish, "Bodyguard")).toBe(true);

    expect(
      testEngine.asPlayerOne().challenge(liloMakingAWish, teKTheBurningOne),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(liloMakingAWish)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(musketeerTabard, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(1);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HerculesTrueHero,
//   LiloMakingAWish,
//   SimbaProtectiveCub,
//   TeKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { musketeerTabard } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Musketeer Tabard", () => {
//   Describe("**ALL FOR ONE AND ONE FOR ALL** Whenever one of your characters with **Bodyguard** is banished, you may draw a card.", () => {
//     It("Triggers when your bodyguard's die", () => {
//       Const testStore = new TestStore(
//         {
//           Deck: 2,
//           Play: [musketeerTabard, simbaProtectiveCub, herculesTrueHero],
//         },
//         {
//           Play: [teKaTheBurningOne],
//         },
//       );
//
//       Const musketeerOne = testStore.getByZoneAndId(
//         "play",
//         SimbaProtectiveCub.id,
//       );
//       Const musketeerTwo = testStore.getByZoneAndId(
//         "play",
//         HerculesTrueHero.id,
//       );
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         TeKaTheBurningOne.id,
//         "player_two",
//       );
//
//       Defender.updateCardMeta({ exerted: true });
//
//       MusketeerOne.challenge(defender);
//       TestStore.resolveTopOfStack();
//       Expect(musketeerOne.zone).toEqual("discard");
//       Expect(testStore.getZonesCardCount().deck).toBe(1);
//
//       MusketeerTwo.challenge(defender);
//       TestStore.resolveTopOfStack();
//       Expect(musketeerTwo.zone).toEqual("discard");
//       Expect(testStore.getZonesCardCount().deck).toBe(0);
//     });
//
//     It("Non bodyguard don't trigger the effect", () => {
//       Const testStore = new TestStore(
//         {
//           Deck: 2,
//           Play: [musketeerTabard, liloMakingAWish],
//         },
//         {
//           Play: [teKaTheBurningOne],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId("play", liloMakingAWish.id);
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         TeKaTheBurningOne.id,
//         "player_two",
//       );
//
//       Defender.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(defender);
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//       Expect(attacker.zone).toEqual("discard");
//       Expect(testStore.getZonesCardCount().deck).toBe(2);
//     });
//
//     It("Opponent's musketeers don't trigger the effect", () => {
//       Const testStore = new TestStore(
//         {
//           Deck: 2,
//           Play: [musketeerTabard, teKaTheBurningOne],
//         },
//         {
//           Play: [simbaProtectiveCub, herculesTrueHero],
//         },
//       );
//
//       Const bodyguardOne = testStore.getByZoneAndId(
//         "play",
//         SimbaProtectiveCub.id,
//         "player_two",
//       );
//       Const bodyguardTwo = testStore.getByZoneAndId(
//         "play",
//         HerculesTrueHero.id,
//         "player_two",
//       );
//       Const defender = testStore.getByZoneAndId("play", teKaTheBurningOne.id);
//
//       Defender.updateCardMeta({ exerted: true });
//
//       BodyguardOne.challenge(defender);
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//       Expect(bodyguardOne.zone).toEqual("discard");
//       Expect(testStore.getZonesCardCount().deck).toBe(2);
//
//       BodyguardTwo.challenge(defender);
//       Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//       Expect(bodyguardTwo.zone).toEqual("discard");
//       Expect(testStore.getZonesCardCount().deck).toBe(2);
//     });
//   });
// });
//
