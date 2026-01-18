import type { CharacterCard } from "@tcg/lorcana-types";
import { evasive } from "../../ability-helpers";

export const tinkerBellPeterPansAlly: CharacterCard = {
  id: "oug",
  cardType: "character",
  name: "Tinker Bell",
  version: "Peter Pan's Ally",
  fullName: "Tinker Bell - Peter Pan's Ally",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "001",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nLOYAL AND DEVOTED Your characters named Peter Pan gain Challenger +1. (They get +1 {S} while challenging.)",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 58,
  inkable: false,
  externalIds: {
    ravensburger: "598be1e1fde814f7659cf509dad4db7131a68730",
  },
  abilities: [
    evasive("oug-1"),
    {
      id: "oug-2",
      text: "LOYAL AND DEVOTED Your characters named Peter Pan gain Challenger +1.",
      name: "LOYAL AND DEVOTED",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 1,
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   challengerAbility,
//   evasiveAbility,
//   type GainAbilityStaticAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const tinkerBellPeterPan: LorcanitoCharacterCard = {
//   id: "xbz",
//
//   name: "Tinker Bell",
//   title: "Peter Pan's Ally",
//   characteristics: ["storyborn", "ally", "fairy"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**LOYAL AND DEVOTED** Your characters named Peter Pan gain **Challenger +1.** _(They get +1 {S} while challenging.)_",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       name: "Loyal and Devoted",
//       text: "Your characters named Peter Pan gain **Challenger +1.** _(They get +1 {S} while challenging.)_",
//       ability: "gain-ability",
//       gainedAbility: challengerAbility(1),
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "zone", value: "play" },
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "self" },
//           {
//             filter: "attribute",
//             value: "name",
//             comparison: { operator: "eq", value: "Peter Pan" },
//           },
//         ],
//       },
//     } as GainAbilityStaticAbility,
//     evasiveAbility,
//   ],
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Adrianne Gumaya",
//   number: 58,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 507488,
//   },
//   rarity: "common",
// };
//
