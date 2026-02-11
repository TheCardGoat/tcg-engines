import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanInjuredSoldier: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "1g0-1",
      name: "BATTLE WOUND",
      text: "BATTLE WOUND This character enters play with 2 damage.",
      type: "static",
    },
  ],
  cardNumber: 125,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 1,
  externalIds: {
    ravensburger: "bb7a79d70c819d07b5aa5eeea67d67b342b43405",
  },
  franchise: "Mulan",
  fullName: "Mulan - Injured Soldier",
  id: "1g0",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mulan",
  set: "009",
  strength: 2,
  text: "BATTLE WOUND This character enters play with 2 damage.",
  version: "Injured Soldier",
  willpower: 3,
};
