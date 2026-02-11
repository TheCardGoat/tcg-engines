// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   PixieDust,
//   PoohPirateShip,
//   YokaiEnigmaticInventor,
// } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Yokai - Enigmatic Inventor", () => {
//   It("TIME TO UPGRADE Whenever this character quests, you may return one of your items to your hand to pay 2 {I} less for the next item you play this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: pixieDust.cost - 2,
//       Play: [yokaiEnigmaticInventor, poohPirateShip],
//       Hand: [pixieDust],
//     });
//     Const targetCard = testEngine.getCardModel(pixieDust);
//
//     Await testEngine.questCard(yokaiEnigmaticInventor);
//     Await testEngine.resolveOptionalAbility();
//
//     Expect(targetCard.cost).toEqual(pixieDust.cost);
//     Await testEngine.resolveTopOfStack({ targets: [poohPirateShip] });
//     Expect(targetCard.cost).toEqual(pixieDust.cost - 2);
//
//     Await testEngine.playCard(pixieDust);
//
//     Expect(targetCard.zone).toEqual("play");
//     Expect(
//       TestEngine.store.continuousEffectStore.continuousEffects,
//     ).toHaveLength(0);
//   });
// });
//
