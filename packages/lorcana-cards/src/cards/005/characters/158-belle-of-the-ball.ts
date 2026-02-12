import type { CharacterCard } from "@tcg/lorcana-types";

export const belleOfTheBall: CharacterCard = {
  abilities: [
    {
      id: "1j3-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
      effect: {
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      id: "1j3-2",
      name: "USHERED INTO THE PARTY",
      text: "USHERED INTO THE PARTY When you play this character, your other characters gain Ward until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 158,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "c796ea97ede34aa2b1d64bb7ef28514ead03681f",
  },
  franchise: "Beauty and the Beast",
  fullName: "Belle - Of the Ball",
  id: "1j3",
  inkType: ["sapphire"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Belle",
  set: "005",
  strength: 2,
  text: "Ward (Opponents can't choose this character except to challenge.)\nUSHERED INTO THE PARTY When you play this character, your other characters gain Ward until the start of your next turn.",
  version: "Of the Ball",
  willpower: 3,
};
