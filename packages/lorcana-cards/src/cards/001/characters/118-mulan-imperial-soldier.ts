import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanImperialSoldier: CharacterCard = {
  id: "nsp",
  cardType: "character",
  name: "Mulan",
  version: "Imperial Soldier",
  fullName: "Mulan - Imperial Soldier",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "001",
  text: "LEAD BY EXAMPLE During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  cardNumber: 118,
  inkable: true,
  externalIds: {
    ravensburger: "55c43a8042650d3b7d79099e5ff68e2941e49d7f",
  },
  abilities: [
    {
      id: "nsp-1",
      text: "LEAD BY EXAMPLE During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.",
      name: "LEAD BY EXAMPLE",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
        duration: "this-turn",
      },
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverBanishesAnotherCharacterInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mulanImperialSoldier: LorcanitoCharacterCard = {
//   id: "cqk",
//   name: "Mulan",
//   title: "Imperial Soldier",
//   characteristics: ["hero", "storyborn", "princess"],
//   text: "**Lead by example** During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.",
//   type: "character",
//   abilities: [
//     wheneverBanishesAnotherCharacterInChallenge({
//       name: "Lead by example",
//       text: "During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.",
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
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 5,
//   strength: 4,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Mel Milton",
//   number: 118,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 516778,
//   },
//   rarity: "super_rare",
// };
//
