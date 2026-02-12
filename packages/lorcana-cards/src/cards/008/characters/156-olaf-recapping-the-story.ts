import type { CharacterCard } from "@tcg/lorcana-types";

export const olafRecappingTheStory: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: -1,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "fgl-1",
      name: "ENDLESS TALE",
      text: "ENDLESS TALE When you play this character, chosen opposing character gets -1 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 156,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "37b8f2d0cca58cc4b2d0a2be27faafff33e16815",
  },
  franchise: "Frozen",
  fullName: "Olaf - Recapping the Story",
  id: "fgl",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Olaf",
  set: "008",
  strength: 2,
  text: "ENDLESS TALE When you play this character, chosen opposing character gets -1 {S} this turn.",
  version: "Recapping the Story",
  willpower: 1,
};
