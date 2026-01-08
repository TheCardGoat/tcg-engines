import type { CharacterCard } from "@tcg/lorcana-types";

export const megaraLiberatedOne: CharacterCard = {
  id: "1qr",
  cardType: "character",
  name: "Megara",
  version: "Liberated One",
  fullName: "Megara - Liberated One",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  text: "Ward (Opponents can't choose this character except to challenge.)\nPEOPLE ALWAYS DO CRAZY THINGS Whenever you play a character named Hercules, you may ready this character.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 80,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e23a2e1df645902673b16b573c2cea51fbfa1a3b",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const megaraLiberatedOne: LorcanitoCharacterCard = {
//   id: "dpb",
//   name: "Megara",
//   title: "Liberated One",
//   characteristics: ["storyborn", "ally"],
//   text: "**Ward** _(Opponents can't choose this character except to challenge.)_\n\n\n**PEOPLE ALWAYS DO CRAZY THINGS** Whenever you play a character named Hercules, you may ready this character.",
//   type: "character",
//   abilities: [
//     wardAbility,
//     wheneverPlays({
//       name: "PEOPLE ALWAYS DO CRAZY THINGS",
//       text: "Whenever you play a character named Hercules, you may ready this character",
//       optional: true,
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "self" },
//           {
//             filter: "attribute",
//             value: "name",
//             comparison: { operator: "eq", value: "hercules" },
//           },
//         ],
//       },
//       effects: [
//         {
//           type: "exert",
//           exert: false,
//           target: thisCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 5,
//   strength: 4,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Ye Yang / Raquel Villameva",
//   number: 80,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549622,
//   },
//   rarity: "uncommon",
// };
//
