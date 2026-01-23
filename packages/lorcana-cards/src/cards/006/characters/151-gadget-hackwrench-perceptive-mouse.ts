import type { CharacterCard } from "@tcg/lorcana-types";

export const gadgetHackwrenchPerceptiveMouse: CharacterCard = {
  id: "7po",
  cardType: "character",
  name: "Gadget Hackwrench",
  version: "Perceptive Mouse",
  fullName: "Gadget Hackwrench - Perceptive Mouse",
  inkType: ["sapphire"],
  franchise: "Rescue Rangers",
  set: "006",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 151,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "1bcc60e54cdd9528c68b185a20ca9163f5c62322",
  },
  classifications: ["Storyborn", "Ally", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const gadgetHackwrenchPerceptiveMouse: LorcanitoCharacterCard = {
//   id: "x39",
//   name: "Gadget Hackwrench",
//   title: "Perceptive Mouse",
//   characteristics: ["storyborn", "ally", "inventor"],
//   type: "character",
//   abilities: [],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Simanta Edini",
//   number: 151,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 585034,
//   },
//   rarity: "common",
// };
//
