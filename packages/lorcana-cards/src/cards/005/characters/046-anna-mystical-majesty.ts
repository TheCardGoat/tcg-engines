import type { CharacterCard } from "@tcg/lorcana-types";

export const annaMysticalMajesty: CharacterCard = {
  id: "iok",
  cardType: "character",
  name: "Anna",
  version: "Mystical Majesty",
  fullName: "Anna - Mystical Majesty",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Anna.)\nEXCEPTIONAL POWER When you play this character, exert all opposing characters.",
  cost: 7,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 46,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "435579c3cb397e6133a748ff09f53a84bb5a48ff",
  },
  abilities: [
    {
      id: "iok-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "iok-2",
      type: "triggered",
      name: "EXCEPTIONAL POWER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "exert",
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "EXCEPTIONAL POWER When you play this character, exert all opposing characters.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Queen", "Sorcerer"],
};
