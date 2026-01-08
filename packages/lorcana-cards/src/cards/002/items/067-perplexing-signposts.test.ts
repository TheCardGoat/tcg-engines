// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { liloGalacticHero } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { perplexingSignposts } from "@lorcanito/lorcana-engine/cards/002/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Perplexing Signposts", () => {
//   it("**TO WONDERLAND** Banish this item – Return chosen character of yours to your hand.", () => {
//     const testStore = new TestStore({
//       play: [perplexingSignposts, liloGalacticHero],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       perplexingSignposts.id,
//     );
//     const target = testStore.getByZoneAndId("play", liloGalacticHero.id);
//
//     cardUnderTest.activate();
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     expect(cardUnderTest.zone).toEqual("discard");
//     expect(target.zone).toEqual("hand");
//   });
// });
//
