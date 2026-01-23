import type { CharacterCard } from "@tcg/lorcana-types";

export const ratiganPartyCrasher: CharacterCard = {
  id: "1b4",
  cardType: "character",
  name: "Ratigan",
  version: "Party Crasher",
  fullName: "Ratigan - Party Crasher",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "005",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Ratigan.)\nEvasive (Only characters with Evasive can challenge this character.)\nDELIGHTFULLY WICKED Your damaged characters get +2 {S}.",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 3,
  cardNumber: 123,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "aaff3438b44616c9f93796643e4f12b9bdd8d044",
  },
  abilities: [],
  classifications: ["Floodborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   evasiveAbility,
//   shiftAbility,
//   yourOtherCharactersWithGain,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const ratiganPartyCrasher: LorcanitoCharacterCard = {
//   id: "enx",
//   missingTestCase: true,
//   name: "Ratigan",
//   title: "Party Crasher",
//   characteristics: ["floodborn", "villain"],
//   text: "**Shift** 4 _(You may pay 4 {I} to play this on top of one of your characters named Ratigan.)_ **Evasive** _(Only characters with Evasive can challenge this character.)_\n **DELIGHTFULLY WICKED** Your damaged characters get +2 {S}.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "ratigan"),
//     evasiveAbility,
//     yourOtherCharactersWithGain({
//       name: "Delightfully Wicked",
//       text: "Your damaged characters get -2 {S}.",
//       filter: {
//         filter: "status",
//         value: "damage",
//         comparison: { operator: "gte", value: 1 },
//       },
//       gainedAbility: {
//         type: "static",
//         ability: "effects",
//         effects: [
//           {
//             type: "attribute",
//             attribute: "strength",
//             amount: 2,
//             modifier: "add",
//             duration: "static",
//             target: thisCharacter,
//           },
//         ],
//       },
//     }),
//   ],
//   colors: ["ruby"],
//   cost: 7,
//   strength: 5,
//   willpower: 5,
//   lore: 3,
//   illustrator: "Nicholas Kole",
//   number: 123,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 557537,
//   },
//   rarity: "rare",
// };
//
