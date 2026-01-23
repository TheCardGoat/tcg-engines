import type { CharacterCard } from "@tcg/lorcana-types";

export const scarMastermind: CharacterCard = {
  id: "1nb",
  cardType: "character",
  name: "Scar",
  version: "Mastermind",
  fullName: "Scar - Mastermind",
  inkType: ["sapphire"],
  franchise: "Lion King",
  set: "001",
  text: "INSIDIOUS PLOT When you play this character, chosen opposing character gets -5 {S} this turn.",
  cost: 6,
  strength: 5,
  willpower: 4,
  lore: 2,
  cardNumber: 158,
  inkable: true,
  externalIds: {
    ravensburger: "d58028e0439679ccda27077c066677d60f1cba4c",
  },
  abilities: [
    {
      id: "1nb-1",
      text: "INSIDIOUS PLOT When you play this character, chosen opposing character gets -5 {S} this turn.",
      name: "INSIDIOUS PLOT",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -5,
        target: "CHOSEN_OPPOSING_CHARACTER",
        duration: "this-turn",
      },
    },
  ],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const scarMastermind: LorcanitoCharacterCard = {
//   id: "l2a",
//   name: "Scar",
//   title: "Mastermind",
//   characteristics: ["storyborn", "villain"],
//   text: "**Insidious plot** When you play this character, chosen opposing character gets -5 {S} this turn.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "Insidious plot",
//       text: "When you play this character, chosen opposing character gets -5 {S} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 5,
//           modifier: "subtract",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: '"The best plans involve a little danger. Just not for me."',
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 6,
//   strength: 5,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Bill Robinson",
//   number: 158,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 485360,
//   },
//   rarity: "rare",
// };
//
