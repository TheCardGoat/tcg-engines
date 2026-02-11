import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { gantuGalacticFederationCaptain } from "./178-gantu-galactic-federation-captain";

describe("Gantu - Galactic Federation Captain", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [gantuGalacticFederationCaptain] });
  //   Expect(testEngine.getCardModel(gantuGalacticFederationCaptain).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GantuGalacticFederationCaptain,
//   HoraceNoGood,
//   JumbaJokibaaRenegadeScientist,
//   TamatoaDrabLittleCrab,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Gantu - Galactic Federation Captain", () => {
//   Describe("**Under arrest** Characters with cost 2 or less can't challenge your characters.", () => {
//     It("Characters with cost 2 or less can't challenge your other characters.", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [tamatoaDrabLittleCrab],
//         },
//         {
//           Play: [gantuGalacticFederationCaptain, jumbaJokibaaRenegadeScientist],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId(
//         "play",
//         TamatoaDrabLittleCrab.id,
//       );
//       Const defender = testStore.getByZoneAndId(
//         "play",
//         JumbaJokibaaRenegadeScientist.id,
//         "player_two",
//       );
//
//       Defender.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(defender);
//
//       Expect(defender.zone).toEqual("play");
//       Expect(defender.meta.damage).toBeFalsy();
//
//       Expect(attacker.zone).toEqual("play");
//       Expect(attacker.meta.damage).toBeFalsy();
//       Expect(attacker.lorcanitoCard.cost).toEqual(2);
//     });
//
//     It("Characters with cost 2 or less can't challenge THIS character.", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [tamatoaDrabLittleCrab],
//         },
//         {
//           Play: [gantuGalacticFederationCaptain],
//         },
//       );
//
//       Const attacker = testStore.getByZoneAndId(
//         "play",
//         TamatoaDrabLittleCrab.id,
//       );
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         GantuGalacticFederationCaptain.id,
//         "player_two",
//       );
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(cardUnderTest);
//
//       Expect(cardUnderTest.zone).toEqual("play");
//       Expect(cardUnderTest.meta.damage).toBeFalsy();
//
//       Expect(attacker.zone).toEqual("play");
//       Expect(attacker.meta.damage).toBeFalsy();
//       Expect(attacker.lorcanitoCard.cost).toEqual(2);
//     });
//
//     It("Characters with cost 3 or more can challenge this character.", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [horaceNoGood],
//         },
//         {
//           Play: [gantuGalacticFederationCaptain],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         GantuGalacticFederationCaptain.id,
//         "player_two",
//       );
//       Const attacker = testStore.getByZoneAndId("play", horaceNoGood.id);
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Attacker.challenge(cardUnderTest);
//
//       Expect(cardUnderTest.zone).toEqual("play");
//       Expect(cardUnderTest.meta.damage).toBeTruthy();
//
//       Expect(attacker.zone).toEqual("discard");
//       Expect(attacker.lorcanitoCard.cost).toEqual(3);
//     });
//   });
// });
//
