import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelGiftedArtist: CharacterCard = {
  id: "n2g",
  cardType: "character",
  name: "Rapunzel",
  version: "Gifted Artist",
  fullName: "Rapunzel - Gifted Artist",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "002",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Rapunzel.)\nLET YOUR POWER SHINE Whenever you remove 1 or more damage from one of your characters, you may draw a card.",
  cost: 5,
  strength: 0,
  willpower: 6,
  lore: 2,
  cardNumber: 19,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5323f351160ce7e27e6c6f0a14b74b17e2b6f539",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverYouHeal } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const rapunzelGiftedArtist: LorcanitoCharacterCard = {
//   id: "d99",
//   name: "Rapunzel",
//   title: "Gifted Artist",
//   characteristics: ["hero", "floodborn", "princess"],
//   text: "**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Rapunzel._)\n\n**LET YOUR POWER SHINE** Whenever you remove 1 or more damage from one of your characters, you may draw a card.",
//   type: "character",
//   abilities: [
//     wheneverYouHeal({
//       name: "Ancient Insight",
//       text: "Whenever you remove 1 or more damage from one of your characters, you may draw a card.",
//       optional: true,
//       effects: [drawACard],
//     }),
//     shiftAbility(3, "rapunzel"),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 5,
//   strength: 0,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Aubrey Archer",
//   number: 19,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525089,
//   },
//   rarity: "uncommon",
// };
//
