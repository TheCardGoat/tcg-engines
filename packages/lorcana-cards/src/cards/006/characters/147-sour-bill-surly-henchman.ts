import type { CharacterCard } from "@tcg/lorcana-types";

export const sourBillSurlyHenchman: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: -2,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "1f5-1",
      name: "UNPALATABLE",
      text: "UNPALATABLE When you play this character, chosen opposing character gets -2 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 147,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "b85405677bfa63f0c76edbe774545fb569d2604a",
  },
  franchise: "Wreck It Ralph",
  fullName: "Sour Bill - Surly Henchman",
  id: "1f5",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Sour Bill",
  set: "006",
  strength: 2,
  text: "UNPALATABLE When you play this character, chosen opposing character gets -2 {S} this turn.",
  version: "Surly Henchman",
  willpower: 3,
};
