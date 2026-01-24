import type { CharacterCard } from "@tcg/lorcana-types";

export const snowWhiteFairestInTheLand: CharacterCard = {
  id: "1wd",
  cardType: "character",
  name: "Snow White",
  version: "Fairest in the Land",
  fullName: "Snow White - Fairest in the Land",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "007",
  text: "HIDDEN AWAY This character can't be challenged.",
  cost: 4,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 33,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f66e2e1e500d2d759c8dcd4fdeafbf1831613d78",
  },
  abilities: [
    {
      id: "1wd-1",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "SELF",
      },
      name: "HIDDEN AWAY",
      text: "HIDDEN AWAY This character can't be challenged.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
