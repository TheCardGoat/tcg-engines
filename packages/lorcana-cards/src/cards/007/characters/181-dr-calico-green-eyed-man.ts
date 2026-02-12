import type { CharacterCard } from "@tcg/lorcana-types";

export const drCalicoGreeneyedMan: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: "SELF",
        type: "gain-keyword",
        value: 2,
      },
      id: "uk6-1",
      text: "YOU'RE BEGINNING TO IRK ME While this character has no damage, he gains Resist +2.",
      type: "static",
    },
  ],
  cardNumber: 181,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 4,
  externalIds: {
    ravensburger: "6e241493e0ee6543ecca03f5f5e315161367b063",
  },
  franchise: "Bolt",
  fullName: "Dr. Calico - Green-Eyed Man",
  id: "uk6",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Dr. Calico",
  set: "007",
  strength: 3,
  text: "YOU'RE BEGINNING TO IRK ME While this character has no damage, he gains Resist +2. (Damage dealt to them is reduced by 2.)",
  version: "Green-Eyed Man",
  willpower: 4,
};
