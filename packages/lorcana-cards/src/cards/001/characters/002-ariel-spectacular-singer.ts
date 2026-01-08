import type { CharacterCard } from "@tcg/lorcana-types";

export const arielSpectacularSinger: CharacterCard = {
  id: "1k6",
  cardType: "character",
  name: "Ariel",
  version: "Spectacular Singer",
  fullName: "Ariel - Spectacular Singer",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "001",
  text: "Singer 5 (This character counts as cost 5 to sing songs.)\nMUSICAL DEBUT When you play this character, look at the top 4 cards of your deck. You may reveal a song card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 2,
  inkable: true,
  externalIds: {
    ravensburger: "cae9d71be6c7f2ae989356aff5c1d3e307890630",
  },
  abilities: [
    {
      id: "1k6-1",
      text: "Singer 5",
      type: "keyword",
      keyword: "Singer",
      value: 5,
    },
    {
      id: "1k6-2",
      text: "MUSICAL DEBUT When you play this character, look at the top 4 cards of your deck. You may reveal a song card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      name: "MUSICAL DEBUT",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "look-at-cards",
          amount: 4,
          from: "top-of-deck",
          target: "CONTROLLER",
          then: {
            action: "put-in-hand",
            count: 1,
          },
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { singerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const arielSpectacularSinger: LorcanitoCharacterCard = {
//   id: "n9e",
//   name: "Ariel",
//   title: "Spectacular Singer",
//   characteristics: ["hero", "storyborn", "princess"],
//   text: "**Singer** 5 _(This character counts as cost 5 to sing songs.)_\n**MUSICAL DEBUT** When you play this character, look at the top 4 cards of your deck. You may reveal a song card and put it into your hand. Put the rest on the bottom of your deck in any order.",
//   type: "character",
//   abilities: [
//     singerAbility(5),
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "MUSICAL DEBUT",
//       text: "When you play this character, look at the top 4 cards of your deck. You may reveal a song card and put it into your hand. Put the rest on the bottom of your deck in any order.",
//       effects: [
//         {
//           type: "scry",
//           amount: 4,
//           mode: "bottom",
//           shouldRevealTutored: true,
//           target: self,
//           limits: {
//             bottom: 4,
//             top: 0,
//             inkwell: 0,
//             hand: 1,
//           },
//           tutorFilters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "deck" },
//             { filter: "characteristics", value: ["song"] },
//           ],
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Alice Pisoni",
//   number: 2,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 504451,
//   },
//   rarity: "super_rare",
// };
//
