import type { CharacterCard } from "@tcg/lorcana-types";

export const johnSilverAlienPirate: CharacterCard = {
  id: "4t5",
  cardType: "character",
  name: "John Silver",
  version: "Alien Pirate",
  fullName: "John Silver - Alien Pirate",
  inkType: ["emerald"],
  franchise: "Treasure Planet",
  set: "009",
  text: "PICK YOUR FIGHTS When you play this character and whenever he quests, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 89,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "11558c64b32cb39749583bcfb6fd5638e6a0ea03",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Alien", "Pirate", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { johnSilverAlienPirate as ogJohnSilverAlienPirate } from "@lorcanito/lorcana-engine/cards/001/characters/082-john-silver-alien-pirate";
//
// export const johnSilverAlienPirate: LorcanitoCharacterCard = {
//   ...ogJohnSilverAlienPirate,
//   id: "hsz",
//   reprints: [ogJohnSilverAlienPirate.id],
//   number: 89,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 647668,
//   },
// };
//
