import type { CharacterCard } from "@tcg/lorcana-types";

export const annaMakingSnowPlans: CharacterCard = {
  id: "9zf",
  cardType: "character",
  name: "Anna",
  version: "Making Snow Plans",
  fullName: "Anna - Making Snow Plans",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "010",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  cardNumber: 139,
  inkable: true,
  externalIds: {
    ravensburger: "23fbbd7099c1f99fe8cea396e7cb66af956ebcb0",
  },
  abilities: [
    {
      id: "9zf-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
  classifications: ["Storyborn", "Hero", "Queen"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const annaMakingSnowPlans: LorcanitoCharacterCard = {
//   id: "myl",
//   name: "Anna",
//   title: "Making Snow Plans",
//   characteristics: ["storyborn", "hero", "queen"],
//   text: "Support",
//   type: "character",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 4,
//   willpower: 3,
//   illustrator: "Pauline Voss",
//   number: 139,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659424,
//   },
//   rarity: "common",
//   abilities: [supportAbility],
//   lore: 2,
// };
//
