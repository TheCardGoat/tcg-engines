import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { jasperCommonCrook } from "./081-jasper-common-crook";
import { simbaProtectiveCub } from "./020-simba-protective-cub";

describe("Jasper - Common Crook", () => {
  it("stops the chosen opposing character from questing during their next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [{ card: jasperCommonCrook, isDrying: false }],
      },
      {
        deck: 2,
        play: [simbaProtectiveCub],
      },
    );
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_TWO);

    expect(testEngine.asPlayerOne().quest(jasperCommonCrook)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(jasperCommonCrook, {
        targets: [simbaId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().quest(simbaProtectiveCub).success).toBe(false);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().quest(simbaProtectiveCub)).toBeSuccessfulCommand();
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   JasperCommonCrook,
//   LiloMakingAWish,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Jasper - Common Crook", () => {
//   It("**PUPPYNAPPING** Whenever this character quests, chosen opposing character can't quest during their next turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Deck: 2,
//         Inkwell: jasperCommonCrook.cost,
//         Play: [jasperCommonCrook],
//       },
//       {
//         Deck: 2,
//         Play: [liloMakingAWish],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       JasperCommonCrook.id,
//     );
//     Const target = testStore.getByZoneAndId(
//       "play",
//       LiloMakingAWish.id,
//       "player_two",
//     );
//
//     CardUnderTest.quest();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     TestStore.store.passTurn("player_one");
//
//     Expect(testStore.store.tableStore.getTable("player_two").lore).toEqual(0);
//     Target.quest();
//     Expect(testStore.store.tableStore.getTable("player_two").lore).toEqual(0);
//   });
// });
//
