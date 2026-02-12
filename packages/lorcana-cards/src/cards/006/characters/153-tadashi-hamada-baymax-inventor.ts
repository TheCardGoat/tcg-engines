import type { CharacterCard } from "@tcg/lorcana-types";

export const tadashiHamadaBaymaxInventor: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "16i-1",
      text: "LET'S GET BACK TO WORK This character gets +1 {S} and +1 {W} for each item you have in play.",
      type: "static",
    },
  ],
  cardNumber: 153,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "Inventor"],
  cost: 6,
  externalIds: {
    ravensburger: "993aaea8ad85362fb36241b749ab1bd73d13fdc7",
  },
  franchise: "Big Hero 6",
  fullName: "Tadashi Hamada - Baymax Inventor",
  id: "16i",
  inkType: ["sapphire"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Tadashi Hamada",
  set: "006",
  strength: 3,
  text: "LET'S GET BACK TO WORK This character gets +1 {S} and +1 {W} for each item you have in play.",
  version: "Baymax Inventor",
  willpower: 3,
};
