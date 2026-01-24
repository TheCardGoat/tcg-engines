import type { CharacterCard } from "@tcg/lorcana-types";

export const tadashiHamadaBaymaxInventor: CharacterCard = {
  id: "16i",
  cardType: "character",
  name: "Tadashi Hamada",
  version: "Baymax Inventor",
  fullName: "Tadashi Hamada - Baymax Inventor",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "LET'S GET BACK TO WORK This character gets +1 {S} and +1 {W} for each item you have in play.",
  cost: 6,
  strength: 3,
  willpower: 3,
  lore: 3,
  cardNumber: 153,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "993aaea8ad85362fb36241b749ab1bd73d13fdc7",
  },
  abilities: [
    {
      id: "16i-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
      text: "LET'S GET BACK TO WORK This character gets +1 {S} and +1 {W} for each item you have in play.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Inventor"],
};
