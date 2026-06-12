import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { aladdinHeroicOutlaw, jetsamUrsulasSpy } from "../characters";
import { stolenScimitar } from "./102-stolen-scimitar";

describe("Stolen Scimitar", () => {
  it("gives chosen Aladdin +2 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [stolenScimitar, aladdinHeroicOutlaw],
    });

    const result = testEngine.asPlayerOne().activateAbility(stolenScimitar, {
      ability: "SLASH",
      targets: [aladdinHeroicOutlaw],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(stolenScimitar)).toEqual(true);
    expect(testEngine.asPlayerOne().getCardStrength(aladdinHeroicOutlaw)).toEqual(
      aladdinHeroicOutlaw.strength + 2,
    );
  });

  it("gives another chosen character +1 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [stolenScimitar, jetsamUrsulasSpy],
    });

    const result = testEngine.asPlayerOne().activateAbility(stolenScimitar, {
      ability: "SLASH",
      targets: [jetsamUrsulasSpy],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(stolenScimitar)).toEqual(true);
    expect(testEngine.asPlayerOne().getCardStrength(jetsamUrsulasSpy)).toEqual(
      jetsamUrsulasSpy.strength + 1,
    );
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AladdinHeroicOutlaw,
//   MoanaOfMotunui,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { stolenScimitar } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Stolen Scimitar", () => {
//   It("[Aladdin] Chosen character get +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.", () => {
//     Const testStore = new TestStore({
//       Play: [stolenScimitar, aladdinHeroicOutlaw],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", stolenScimitar.id);
//     Const target = testStore.getByZoneAndId("play", aladdinHeroicOutlaw.id);
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     Expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) + 2);
//   });
//
//   It("[Non Aladdin] Chosen character get +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.", () => {
//     Const testStore = new TestStore({
//       Play: [stolenScimitar, moanaOfMotunui],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", stolenScimitar.id);
//     Const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     Expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) + 1);
//   });
// });
//
