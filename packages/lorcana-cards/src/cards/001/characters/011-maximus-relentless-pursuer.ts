import type { CharacterCard } from "@tcg/lorcana-types";
import { rush, whenPlay } from "../../ability-helpers";

export const maximusRelentlessPursuer: CharacterCard = {
  id: "2z0",
  cardType: "character",
  name: "Maximus",
  version: "Relentless Pursuer",
  fullName: "Maximus - Relentless Pursuer",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "001",
  text: "Rush HORSE KICK When you play this character, chosen character gets -2 {S} this turn.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 11,
  inkable: true,
  externalIds: {
    ravensburger: "0ab6dfaa2b7d68e702c7a1f3f1ea67f1e2789b76",
  },
  abilities: [
    rush("2z0-1"),
    whenPlay("2z0-2", {
      name: "HORSE KICK",
      text: "HORSE KICK When you play this character, chosen character gets -2 {S} this turn.",
      playedBy: "you",
      playedCard: "SELF",
      then: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    }),
  ],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const maximusRentlessPersuer: LorcanitoCharacterCard = {
//   id: "ak8",
//
//   name: "Maximus",
//   title: "Relentless Pursuer",
//   characteristics: ["dreamborn", "ally"],
//   text: "**HORSE KICK** When you play this character, chosen character gets -2 {S} this turn.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "HORSE KICK",
//       text: "When you play this character, chosen character gets -2 {S} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "subtract",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "He pursues his quarry with courage, discipline, \rand a touch of class.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Kendall Hale",
//   number: 11,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 494101,
//   },
//   rarity: "uncommon",
// };
//
