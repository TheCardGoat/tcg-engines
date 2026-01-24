import type { CharacterCard } from "@tcg/lorcana-types";

export const olafRecappingTheStory: CharacterCard = {
  id: "fgl",
  cardType: "character",
  name: "Olaf",
  version: "Recapping the Story",
  fullName: "Olaf - Recapping the Story",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "008",
  text: "ENDLESS TALE When you play this character, chosen opposing character gets -1 {S} this turn.",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 156,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "37b8f2d0cca58cc4b2d0a2be27faafff33e16815",
  },
  abilities: [
    {
      id: "fgl-1",
      type: "triggered",
      name: "ENDLESS TALE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      text: "ENDLESS TALE When you play this character, chosen opposing character gets -1 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
