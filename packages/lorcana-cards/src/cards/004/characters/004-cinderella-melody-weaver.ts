import type { CharacterCard } from "@tcg/lorcana-types";

export const cinderellaMelodyWeaver: CharacterCard = {
  id: "juj",
  cardType: "character",
  name: "Cinderella",
  version: "Melody Weaver",
  fullName: "Cinderella - Melody Weaver",
  inkType: ["amber"],
  franchise: "Cinderella",
  set: "004",
  text: "Singer 9 (This character counts as cost 9 to sing songs.)\nBEAUTIFUL VOICE Whenever this character sings a song, your other Princess characters get +1 {L} this turn.",
  cost: 5,
  strength: 1,
  willpower: 5,
  lore: 2,
  cardNumber: 4,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4788d25c0a43283f16dc66d4840c94239e9cdbda",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { singerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverThisCharSings } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const cinderellaMelodyWeaver: LorcanitoCharacterCard = {
//   id: "mma",
//   name: "Cinderella",
//   title: "Melody Weaver",
//   characteristics: ["hero", "dreamborn", "princess"],
//   text: "**Singer** 9 _(This character counts as cost 9 to sing songs.)_\n\n\n**BEAUTIFUL VOICE** Whenever this character sings a song, your other Princess characters get +1 {L} this turn.",
//   type: "character",
//   abilities: [
//     singerAbility(9),
//     wheneverThisCharSings({
//       name: "Beautiful Voice",
//       text: "Whenever this character sings a song, your other Princess characters get +1 {L} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 1,
//           modifier: "add",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: "all",
//             excludeSelf: true,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "characteristics", value: ["princess"] },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 5,
//   strength: 1,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Miss Tania Soler",
//   number: 4,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549624,
//   },
//   rarity: "legendary",
// };
//
