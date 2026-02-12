import type { CharacterCard } from "@tcg/lorcana-types";

export const annaMysticalMajesty: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "iok-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
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
      id: "iok-2",
      name: "EXCEPTIONAL POWER",
      text: "EXCEPTIONAL POWER When you play this character, exert all opposing characters.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 46,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Queen", "Sorcerer"],
  cost: 7,
  externalIds: {
    ravensburger: "435579c3cb397e6133a748ff09f53a84bb5a48ff",
  },
  franchise: "Frozen",
  fullName: "Anna - Mystical Majesty",
  id: "iok",
  inkType: ["amethyst"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Anna",
  set: "005",
  strength: 4,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Anna.)\nEXCEPTIONAL POWER When you play this character, exert all opposing characters.",
  version: "Mystical Majesty",
  willpower: 5,
};
