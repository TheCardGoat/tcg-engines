import type { CharacterCard } from "@tcg/lorcana-types";
import { rush } from "../../ability-helpers";

export const captainHookRuthlessPirate: CharacterCard = {
  id: "1k7",
  cardType: "character",
  name: "Captain Hook",
  version: "Ruthless Pirate",
  fullName: "Captain Hook - Ruthless Pirate",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "001",
  text: "Rush (This character can challenge the turn they're played.)\nYOU COWARD! While this character is exerted, opposing characters with Evasive gain Reckless. (They can't quest and must challenge if able.)",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 107,
  inkable: false,
  externalIds: {
    ravensburger: "cb7f49afcece80ca059a1b80ac84424a7d69eeaa",
  },
  abilities: [
    rush("1k7-1"),
    {
      id: "1k7-2",
      text: "YOU COWARD! While this character is exerted, opposing characters with Evasive gain Reckless.",
      name: "YOU COWARD!",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "SELF",
        duration: "this-turn",
      },
    },
  ],
  classifications: ["Storyborn", "Villain", "Pirate", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   recklessAbility,
//   rushAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whileConditionOnThisCharacterTargetsGain } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const captainHookRecklessPirate: LorcanitoCharacterCard = {
//   id: "heh",
//   name: "Captain Hook",
//   title: "Ruthless Pirate",
//   characteristics: ["storyborn", "villain", "pirate", "captain"],
//   text: "**Rush** _(This character can challenge the turn they're played.)_\n\n**YOU COWARD!** While this character is exerted, opposing characters with **Evasive** gain **Reckless**. _(They can't quest and must challenge if able.)_",
//   type: "character",
//   abilities: [
//     rushAbility,
//     whileConditionOnThisCharacterTargetsGain({
//       name: "You Coward!",
//       text: "While this character is exerted, opposing characters with **Evasive** gain **Reckless**. _(They can't quest and must challenge if able.)_",
//       conditions: [{ type: "exerted" }],
//       ability: recklessAbility,
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "opponent" },
//           { filter: "zone", value: "play" },
//           {
//             filter: "ability",
//             value: "evasive",
//           },
//         ],
//       },
//     }),
//   ],
//   flavour: "You wouldn't dare fight old Hook man-to-man!",
//   colors: ["ruby"],
//   cost: 7,
//   strength: 5,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Cam Kendell",
//   number: 107,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508624,
//   },
//   rarity: "rare",
// };
//
