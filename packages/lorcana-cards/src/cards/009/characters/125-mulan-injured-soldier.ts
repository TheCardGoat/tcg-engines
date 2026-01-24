import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanInjuredSoldier: CharacterCard = {
  id: "1g0",
  cardType: "character",
  name: "Mulan",
  version: "Injured Soldier",
  fullName: "Mulan - Injured Soldier",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "009",
  text: "BATTLE WOUND This character enters play with 2 damage.",
  cost: 1,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 125,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bb7a79d70c819d07b5aa5eeea67d67b342b43405",
  },
  abilities: [
    {
      id: "1g0-1",
      type: "static",
      effect: {
        type: "play-card",
        from: "hand",
      },
      name: "BATTLE WOUND",
      text: "BATTLE WOUND This character enters play with 2 damage.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
