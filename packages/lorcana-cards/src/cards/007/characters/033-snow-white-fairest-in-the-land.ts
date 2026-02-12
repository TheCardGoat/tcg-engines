import type { CharacterCard } from "@tcg/lorcana-types";

export const snowWhiteFairestInTheLand: CharacterCard = {
  abilities: [
    {
      effect: {
        restriction: "cant-be-challenged",
        target: "SELF",
        type: "restriction",
      },
      id: "1wd-1",
      name: "HIDDEN AWAY",
      text: "HIDDEN AWAY This character can't be challenged.",
      type: "static",
    },
  ],
  cardNumber: 33,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "f66e2e1e500d2d759c8dcd4fdeafbf1831613d78",
  },
  franchise: "Snow White",
  fullName: "Snow White - Fairest in the Land",
  id: "1wd",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Snow White",
  set: "007",
  strength: 2,
  text: "HIDDEN AWAY This character can't be challenged.",
  version: "Fairest in the Land",
  willpower: 2,
};
