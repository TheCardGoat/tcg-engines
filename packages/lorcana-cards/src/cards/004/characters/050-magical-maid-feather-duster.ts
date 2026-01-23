import type { CharacterCard } from "@tcg/lorcana-types";

export const magicalMaidFeatherDuster: CharacterCard = {
  id: "gwp",
  cardType: "character",
  name: "Magical Maid",
  version: "Feather Duster",
  fullName: "Magical Maid - Feather Duster",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "004",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 50,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "3cf0665cbe209cfcd209d0dafda36571bc0d96ba",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const magicalMaidFeatherDuster: LorcanitoCharacterCard = {
//   id: "dx1",
//   name: "Magical Maid",
//   title: "Feather Duster",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour:
//     'Have you ever seen anything so beautiful?" she asked, marveling at the Amethyst trees.\n"No, cherie," Lumiere replied, never taking his eyes off her. "I have not."',
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Natalia Trykowska",
//   number: 50,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550568,
//   },
//   rarity: "uncommon",
// };
//
