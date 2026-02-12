import type { CharacterCard } from "@tcg/lorcana-types";

export const balooVonBruinwaldXiii: CharacterCard = {
  abilities: [
    {
      id: "owv-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "owv-2",
      name: "LET'S MAKE LIKE A TREE",
      text: "LET'S MAKE LIKE A TREE When this character is banished, gain 2 lore.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 1,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "59ca12ef2ed51d7e5c544d6de0d81a98cc06daee",
  },
  franchise: "Talespin",
  fullName: "Baloo - von Bruinwald XIII",
  id: "owv",
  inkType: ["amber"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Baloo",
  set: "003",
  strength: 0,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nLET'S MAKE LIKE A TREE When this character is banished, gain 2 lore.",
  version: "von Bruinwald XIII",
  willpower: 3,
};
