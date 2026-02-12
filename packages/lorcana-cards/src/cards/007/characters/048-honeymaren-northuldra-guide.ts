import type { CharacterCard } from "@tcg/lorcana-types";

export const honeymarenNorthuldraGuide: CharacterCard = {
  abilities: [
    {
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
      id: "1d4-1",
      name: "TALE OF THE FIFTH SPIRIT",
      text: "TALE OF THE FIFTH SPIRIT When you play this character, if an opponent has an exerted character in play, gain 1 lore.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 48,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "b37f54cccdfd81e4fac8a77d3054a00ee72b292d",
  },
  franchise: "Frozen",
  fullName: "Honeymaren - Northuldra Guide",
  id: "1d4",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Honeymaren",
  set: "007",
  strength: 2,
  text: "TALE OF THE FIFTH SPIRIT When you play this character, if an opponent has an exerted character in play, gain 1 lore.",
  version: "Northuldra Guide",
  willpower: 2,
};
