import type { CharacterCard } from "@tcg/lorcana-types";

export const balooVonBruinwaldXiii: CharacterCard = {
  id: "owv",
  cardType: "character",
  name: "Baloo",
  version: "von Bruinwald XIII",
  fullName: "Baloo - von Bruinwald XIII",
  inkType: ["amber"],
  franchise: "Talespin",
  set: "003",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nLET'S MAKE LIKE A TREE When this character is banished, gain 2 lore.",
  cost: 3,
  strength: 0,
  willpower: 3,
  lore: 1,
  cardNumber: 1,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "59ca12ef2ed51d7e5c544d6de0d81a98cc06daee",
  },
  abilities: [
    {
      id: "owv-1",
      type: "keyword",
      keyword: "Bodyguard",
      text: "Bodyguard",
    },
    {
      id: "owv-2",
      type: "triggered",
      name: "LET'S MAKE LIKE A TREE",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
      text: "LET'S MAKE LIKE A TREE When this character is banished, gain 2 lore.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
