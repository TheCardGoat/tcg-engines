import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomAerialCleaner: CharacterCard = {
  id: "1wc",
  cardType: "character",
  name: "Magic Broom",
  version: "Aerial Cleaner",
  fullName: "Magic Broom - Aerial Cleaner",
  inkType: ["steel"],
  franchise: "Fantasia",
  set: "004",
  text: "WINGED FOR A DAY During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 185,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f6509eea3856a16a7ece4d30d8f5d504b976f27f",
  },
  abilities: [
    {
      id: "1wc-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      text: "WINGED FOR A DAY During your turn, this character gains Evasive.",
    },
  ],
  classifications: ["Dreamborn", "Broom"],
};
