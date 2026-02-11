import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomAerialCleaner: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      id: "1wc-1",
      text: "WINGED FOR A DAY During your turn, this character gains Evasive.",
      type: "action",
    },
  ],
  cardNumber: 185,
  cardType: "character",
  classifications: ["Dreamborn", "Broom"],
  cost: 2,
  externalIds: {
    ravensburger: "f6509eea3856a16a7ece4d30d8f5d504b976f27f",
  },
  franchise: "Fantasia",
  fullName: "Magic Broom - Aerial Cleaner",
  id: "1wc",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Magic Broom",
  set: "004",
  strength: 2,
  text: "WINGED FOR A DAY During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  version: "Aerial Cleaner",
  willpower: 3,
};
