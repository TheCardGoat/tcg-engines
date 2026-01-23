import type { CharacterCard } from "@tcg/lorcana-types";

export const chernabogEvildoer: CharacterCard = {
  id: "r3g",
  cardType: "character",
  name: "Chernabog",
  version: "Evildoer",
  fullName: "Chernabog - Evildoer",
  inkType: ["amber"],
  franchise: "Fantasia",
  set: "003",
  text: "THE POWER OF EVIL For each character card in your discard, you pay 1 {I} less to play this character.\nSUMMON THE SPIRITS When you play this character, shuffle all character cards from your discard into your deck.",
  cost: 10,
  strength: 9,
  willpower: 9,
  lore: 3,
  cardNumber: 3,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "61a80f2f88c8834ee4e9f7ab5c36239495197b09",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const chernabogEvildoer: LorcanitoCharacterCard = {
//   id: "zif",
//   name: "Chernabog",
//   title: "Evildoer",
//   characteristics: ["storyborn", "villain"],
//   text: "**THE POWER OF EVIL** When you play this character, pay 1 {I} less for every character card in your discard.\n\n\n**SUMMON THE SPIRITS** When you play this character, shuffle all character cards from your discard into your deck.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisForEachYouPayLess({
//       name: "The Power of Evil",
//       text: "When you play this character, pay 1 {I} less for every character card in your discard.",
//       amount: {
//         dynamic: true,
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "discard" },
//         ],
//       },
//     }),
//     {
//       type: "resolution",
//       name: "Summon the Spirits",
//       text: "When you play this character, shuffle all character cards from your discard into your deck.",
//       effects: [
//         {
//           type: "shuffle",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "discard" },
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "The darkness calls all its subjects.",
//   colors: ["amber"],
//   strength: 9,
//   willpower: 9,
//   cost: 10,
//   lore: 3,
//   illustrator: "Evana Kisa / Jochem van Gool",
//   number: 3,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 539061,
//   },
//   rarity: "super_rare",
// };
//
