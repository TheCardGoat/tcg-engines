import type { CharacterCard } from "@tcg/lorcana-types";

export const jimHawkinsSpaceTraveler: CharacterCard = {
  abilities: [
    {
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
      id: "tdh-1",
      name: "THIS IS IT!",
      text: "THIS IS IT! When you play this character, you may play a location with cost 4 or less for free.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 109,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "69de13009dc28237f575685f6879507f0b8a9a5e",
  },
  franchise: "Treasure Planet",
  fullName: "Jim Hawkins - Space Traveler",
  id: "tdh",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Jim Hawkins",
  set: "003",
  strength: 4,
  text: "THIS IS IT! When you play this character, you may play a location with cost 4 or less for free.\nTAKE THE HELM Whenever you play a location, this character may move there for free.",
  version: "Space Traveler",
  willpower: 4,
};
