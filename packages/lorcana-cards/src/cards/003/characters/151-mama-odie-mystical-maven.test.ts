// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mauriceWorldFamousInventor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { mamaOdieMysticalMaven } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { iFindEmIFlattenEm } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mama Odie - Mystical Maven", () => {
//   It("**THIS GOING TO BE GOOD** Whenever you play a song, you may put the top card of your deck into your inkwell facedown and exerted.", () => {
//     Const testStore = new TestStore({
//       Inkwell: iFindEmIFlattenEm.cost,
//       Play: [mamaOdieMysticalMaven],
//       Hand: [iFindEmIFlattenEm],
//       Deck: [mauriceWorldFamousInventor],
//     });
//
//     Const trigger = testStore.getCard(iFindEmIFlattenEm);
//     Const topDeckCard = testStore.getCard(mauriceWorldFamousInventor);
//
//     Trigger.playFromHand();
//     TestStore.resolveOptionalAbility();
//     Expect(topDeckCard.zone).toEqual("inkwell");
//     Expect(topDeckCard.ready).toEqual(false);
//   });
// });
//
