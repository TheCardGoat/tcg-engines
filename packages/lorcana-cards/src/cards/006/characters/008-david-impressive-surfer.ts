import type { CharacterCard } from "@tcg/lorcana-types";

export const davidImpressiveSurfer: CharacterCard = {
  id: "mrs",
  cardType: "character",
  name: "David",
  version: "Impressive Surfer",
  fullName: "David - Impressive Surfer",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "SHOWING OFF While you have a character named Nani in play, this character gets +2 {L}.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 8,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "52123a15d637dba3a83c1fd4207aff4423cd424e",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileYouHaveACharacterNamedThisCharGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const davidImpressiveSurfer: LorcanitoCharacterCard = {
//   id: "i5s",
//   missingTestCase: true,
//   name: "David",
//   title: "Impressive Surfer",
//   characteristics: ["storyborn", "ally"],
//   text: "SHOWING OFF While you have a character named Nani in play, this character gets +2 {L}.",
//   type: "character",
//   abilities: [
//     whileYouHaveACharacterNamedThisCharGets({
//       name: "Showing Off",
//       text: "While you have a character named Nani in play, this character gets +2 {L}.",
//       characterName: "Nani",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 2,
//           modifier: "add",
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Valentin Palombo",
//   number: 8,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592006,
//   },
//   rarity: "uncommon",
// };
//
