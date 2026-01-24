import type { CharacterCard } from "@tcg/lorcana-types";

export const sourBillSurlyHenchman: CharacterCard = {
  id: "1f5",
  cardType: "character",
  name: "Sour Bill",
  version: "Surly Henchman",
  fullName: "Sour Bill - Surly Henchman",
  inkType: ["sapphire"],
  franchise: "Wreck It Ralph",
  set: "006",
  text: "UNPALATABLE When you play this character, chosen opposing character gets -2 {S} this turn.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 147,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b85405677bfa63f0c76edbe774545fb569d2604a",
  },
  abilities: [
    {
      id: "1f5-1",
      type: "triggered",
      name: "UNPALATABLE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      text: "UNPALATABLE When you play this character, chosen opposing character gets -2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
