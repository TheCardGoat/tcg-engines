import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomIlluminaryKeeper: CharacterCard = {
  id: "1ct",
  cardType: "character",
  name: "Magic Broom",
  version: "Illuminary Keeper",
  fullName: "Magic Broom - Illuminary Keeper",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "004",
  text: "NICE AND TIDY Whenever you play another character, you may banish this character to draw a card.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 48,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "aff7e808c09b68f3e297df1e5cd256f7f646571d",
  },
  abilities: [],
  classifications: ["Dreamborn", "Broom"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverTargetPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const magicBroomIlluminaryKeeper: LorcanitoCharacterCard = {
//   id: "kgu",
//   name: "Magic Broom",
//   title: "Illuminary Keeper",
//   characteristics: ["dreamborn", "broom"],
//   text: "**NICE AND TIDY** Whenever you play another character, you man banish this character to draw a card.",
//   type: "character",
//   abilities: [
//     wheneverTargetPlays({
//       name: "NICE AND TIDY",
//       text: "Whenever you play another character, you may banish this character to draw a card.",
//       optional: true,
//       costs: [{ type: "banish" }],
//       excludeSelf: true,
//       triggerFilter: [
//         { filter: "type", value: "character" },
//         { filter: "owner", value: "self" },
//       ],
//       effects: [
//         {
//           type: "draw",
//           amount: 1,
//           target: self,
//         },
//       ],
//     }),
//     {
//       name: "**NICE AND TIDY** Whenever you play another character, you man banish this character to draw a card.",
//     },
//   ],
//   flavour: "Just a few barnacles away from retirement...",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 1,
//   strength: 1,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Eva Wildermann",
//   number: 48,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549715,
//   },
//   rarity: "common",
// };
//
