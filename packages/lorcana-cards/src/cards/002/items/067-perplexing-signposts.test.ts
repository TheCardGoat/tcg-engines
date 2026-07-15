// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloGalacticHero } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { perplexingSignposts } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Perplexing Signposts", () => {
//   It("**TO WONDERLAND** Banish this item – Return chosen character of yours to your hand.", () => {
//     Const testStore = new TestStore({
//       Play: [perplexingSignposts, liloGalacticHero],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PerplexingSignposts.id,
//     );
//     Const target = testStore.getByZoneAndId("play", liloGalacticHero.id);
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(cardUnderTest.zone).toEqual("discard");
//     Expect(target.zone).toEqual("hand");
//   });
// });
//
