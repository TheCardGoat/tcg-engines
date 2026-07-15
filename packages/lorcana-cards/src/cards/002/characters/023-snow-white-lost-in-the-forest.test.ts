// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { donaldDuckMusketeer } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { snowWhiteLostInTheForest } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Snow White - Lost in the Forest", () => {
//   It("**I WON'T HURT YOU** When you play this character, you may remove up to 2 damage from chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: snowWhiteLostInTheForest.cost,
//       Hand: [snowWhiteLostInTheForest],
//       Play: [donaldDuckMusketeer],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       SnowWhiteLostInTheForest.id,
//     );
//     Const target = testStore.getByZoneAndId("play", donaldDuckMusketeer.id);
//
//     Target.updateCardMeta({ damage: 3 });
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(cardUnderTest.zone).toEqual("play");
//     Expect(target.meta.damage).toEqual(1);
//   });
// });
//
