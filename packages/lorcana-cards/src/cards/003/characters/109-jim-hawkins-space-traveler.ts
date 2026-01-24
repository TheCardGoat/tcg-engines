import type { CharacterCard } from "@tcg/lorcana-types";

export const jimHawkinsSpaceTraveler: CharacterCard = {
  id: "tdh",
  cardType: "character",
  name: "Jim Hawkins",
  version: "Space Traveler",
  fullName: "Jim Hawkins - Space Traveler",
  inkType: ["ruby"],
  franchise: "Treasure Planet",
  set: "003",
  text: "THIS IS IT! When you play this character, you may play a location with cost 4 or less for free.\nTAKE THE HELM Whenever you play a location, this character may move there for free.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 109,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "69de13009dc28237f575685f6879507f0b8a9a5e",
  },
  abilities: [
    {
      id: "tdh-1",
      type: "triggered",
      name: "THIS IS IT!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 4,
          },
        },
        chooser: "CONTROLLER",
      },
      text: "THIS IS IT! When you play this character, you may play a location with cost 4 or less for free.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
