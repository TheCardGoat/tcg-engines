import type { CharacterCard } from "@tcg/lorcana-types";

export const peteBadGuy: CharacterCard = {
  id: "kek",
  cardType: "character",
  name: "Pete",
  version: "Bad Guy",
  fullName: "Pete - Bad Guy",
  inkType: ["emerald"],
  set: "002",
  franchise: "Mickey and Friends",
  text: "Ward (Opponents can't choose this character except to challenge.)\nTAKE THAT! Whenever you play an action, this character gets +2 {S} this turn.\nWHO'S NEXT? While this character has 7 {S} or more, he gets +2 {L}.",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 88,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "498a07d34db6a52ef27e29b54a76950cc05708d7",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { whileConditionThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const peteBadGuy: LorcanitoCharacterCard = {
//   id: "rsd",
//   name: "Pete",
//   title: "Bad Guy",
//   characteristics: ["storyborn", "villain"],
//   text: "**Ward** _(Opponents can't choose this character except to challenge.)_\n\n**TAKE THAT!** Whenever you play an action, this character gets +2 {S} this turn.\n\n**WHO'S NEXT** While this character has 7 {S} or more, he gets +2 {L}.",
//   type: "character",
//   abilities: [
//     wardAbility,
//     wheneverPlays({
//       name: "Take That!",
//       text: "Whenever you play an action, this character gets +2 {S} this turn.",
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "action" },
//           { filter: "characteristics", value: ["action"] },
//           { filter: "owner", value: "self" },
//         ],
//       },
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "add",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "self" }],
//           },
//         },
//       ],
//     }),
//     whileConditionThisCharacterGets({
//       name: "Who's Next",
//       text: "While this character has 7 {S} or more, he gets +2 {L}.",
//       attribute: "lore",
//       amount: 2,
//       conditions: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           comparison: { operator: "gte", value: 7 },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 5,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Hedvig Häggman-Sund",
//   number: 88,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527749,
//   },
//   rarity: "rare",
// };
//
