import type { CharacterCard } from "@tcg/lorcana-types";

export const littleJohnSirReginald: CharacterCard = {
  id: "1mt",
  cardType: "character",
  name: "Little John",
  version: "Sir Reginald",
  fullName: "Little John - Sir Reginald",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "009",
  text: "WHAT A BEAUTIFUL BRAWL! When you play this character, choose one:\n- Chosen Hero character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)\n- Deal 2 damage to chosen Villain character.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 176,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d409daa7c57554709734ba935a4ef64ae6db2b51",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};
