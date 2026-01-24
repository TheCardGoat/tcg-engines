import type { CharacterCard } from "@tcg/lorcana-types";

export const honeymarenNorthuldraGuide: CharacterCard = {
  id: "1d4",
  cardType: "character",
  name: "Honeymaren",
  version: "Northuldra Guide",
  fullName: "Honeymaren - Northuldra Guide",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "007",
  text: "TALE OF THE FIFTH SPIRIT When you play this character, if an opponent has an exerted character in play, gain 1 lore.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 48,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b37f54cccdfd81e4fac8a77d3054a00ee72b292d",
  },
  abilities: [
    {
      id: "1d4-1",
      type: "triggered",
      name: "TALE OF THE FIFTH SPIRIT",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "an opponent has an exerted character in play",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
      text: "TALE OF THE FIFTH SPIRIT When you play this character, if an opponent has an exerted character in play, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
