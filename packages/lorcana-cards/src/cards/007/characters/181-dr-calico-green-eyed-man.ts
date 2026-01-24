import type { CharacterCard } from "@tcg/lorcana-types";

export const drCalicoGreeneyedMan: CharacterCard = {
  id: "uk6",
  cardType: "character",
  name: "Dr. Calico",
  version: "Green-Eyed Man",
  fullName: "Dr. Calico - Green-Eyed Man",
  inkType: ["steel"],
  franchise: "Bolt",
  set: "007",
  text: "YOU'RE BEGINNING TO IRK ME While this character has no damage, he gains Resist +2. (Damage dealt to them is reduced by 2.)",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 181,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6e241493e0ee6543ecca03f5f5e315161367b063",
  },
  abilities: [
    {
      id: "uk6-1",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "SELF",
        value: 2,
      },
      text: "YOU'RE BEGINNING TO IRK ME While this character has no damage, he gains Resist +2.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
