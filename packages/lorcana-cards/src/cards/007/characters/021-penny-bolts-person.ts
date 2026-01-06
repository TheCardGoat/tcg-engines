import type { CharacterCard } from "@tcg/lorcana-types";

export const pennyBoltsPerson: CharacterCard = {
  id: "i2f",
  cardType: "character",
  name: "Penny",
  version: "Bolt's Person",
  fullName: "Penny - Bolt's Person",
  inkType: ["amber", "steel"],
  franchise: "Bolt",
  set: "007",
  text: "ENDURING LOYALTY When you play this character, you may remove up to 2 damage from chosen character and they gain Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 21,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "411deec2bc09d6d9bad7ac874b976b9ef4264678",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};
