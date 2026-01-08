import type { CharacterCard } from "@tcg/lorcana-types";

export const heathcliffStoicButler: CharacterCard = {
  id: "fob",
  cardType: "character",
  name: "Heathcliff",
  version: "Stoic Butler",
  fullName: "Heathcliff - Stoic Butler",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "006",
  text: "Ward (Opponents can't choose this character except to challenge.)",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 78,
  inkable: true,
  externalIds: {
    ravensburger: "387e97baeef07c3cc3b5128b8604c359f50b3818",
  },
  abilities: [
    {
      id: "fob-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const heathcliffStoicButler: LorcanitoCharacterCard = {
//   id: "rhq",
//   name: "Heathcliff",
//   title: "Stoic Butler",
//   characteristics: ["storyborn", "ally"],
//   text: "Ward (Opponents can't choose this character except to challenge.)",
//   type: "character",
//   abilities: [wardAbility],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Veronica Di Lorenzo / Livio Cacciatore",
//   number: 78,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593010,
//   },
//   rarity: "uncommon",
// };
//
