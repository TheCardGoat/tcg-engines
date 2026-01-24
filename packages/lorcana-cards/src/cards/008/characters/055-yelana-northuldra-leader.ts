import type { CharacterCard } from "@tcg/lorcana-types";

export const yelanaNorthuldraLeader: CharacterCard = {
  id: "17l",
  cardType: "character",
  name: "Yelana",
  version: "Northuldra Leader",
  fullName: "Yelana - Northuldra Leader",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "008",
  text: "WE ONLY TRUST NATURE When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 55,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9d1ce7675bbc9d3acf0c5fad0896029f068795e6",
  },
  abilities: [
    {
      id: "17l-1",
      type: "triggered",
      name: "WE ONLY TRUST NATURE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        value: 2,
        duration: "this-turn",
      },
      text: "WE ONLY TRUST NATURE When you play this character, chosen character gains Challenger +2 this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
