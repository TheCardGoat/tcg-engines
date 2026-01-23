import type { CharacterCard } from "@tcg/lorcana-types";

export const littleJohnImpermanentOutlaw: CharacterCard = {
  id: "196",
  cardType: "character",
  name: "Little John",
  version: "Impermanent Outlaw",
  fullName: "Little John - Impermanent Outlaw",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "010",
  text: "Boost 3 {I} (Once during your turn, you may pay 3 {I} to put the top card of your deck facedown under this character.)\nREADY TO RASSLE Whenever you put a card under this character, ready him.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 3,
  cardNumber: 92,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a2df8f284f006d9047e4f3ea54e2828ecf646753",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Whisper"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   boostAbility,
//   wheneverYouPutACardUnder,
// } from "@lorcanito/lorcana-engine/abilities/boostAbility";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const littleJohnImpermanentOutlaw: LorcanitoCharacterCard = {
//   id: "noi",
//   name: "Little John",
//   title: "Impermanent Outlaw",
//   characteristics: ["storyborn", "ally", "whisper"],
//   text: "Boost 3 {I} (Once during your turn, you may pay 3 {I} to put the top card of your deck facedown under this character.)\nREADY TO RASSLE Whenever you put a card under this character, ready him.",
//   type: "character",
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 6,
//   strength: 4,
//   willpower: 5,
//   illustrator: "Nicholas Kole",
//   number: 92,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659413,
//   },
//   rarity: "super_rare",
//   lore: 3,
//   abilities: [
//     boostAbility(3),
//     wheneverYouPutACardUnder({
//       name: "READY TO RASSLE",
//       text: "Whenever you put a card under this character, ready him.",
//       effects: [
//         {
//           type: "exert",
//           exert: false,
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
// };
//
