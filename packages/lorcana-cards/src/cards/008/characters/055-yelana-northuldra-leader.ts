import type { CharacterCard } from "@tcg/lorcana-types";

export const yelanaNorthuldraLeader: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
        value: 2,
      },
      id: "17l-1",
      name: "WE ONLY TRUST NATURE",
      text: "WE ONLY TRUST NATURE When you play this character, chosen character gains Challenger +2 this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 55,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "9d1ce7675bbc9d3acf0c5fad0896029f068795e6",
  },
  franchise: "Frozen",
  fullName: "Yelana - Northuldra Leader",
  id: "17l",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Yelana",
  set: "008",
  strength: 2,
  text: "WE ONLY TRUST NATURE When you play this character, chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  version: "Northuldra Leader",
  willpower: 3,
};
