import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarRoyalVizier: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1gq-1",
      text: "I DON'T TRUST HIM, SIRE During your turn, this character gains Evasive.",
      type: "action",
    },
  ],
  cardNumber: 181,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 2,
  externalIds: {
    ravensburger: "be0604ebb303eab26c710c79ed684067cfb6873f",
  },
  franchise: "Aladdin",
  fullName: "Jafar - Royal Vizier",
  id: "1gq",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Jafar",
  set: "009",
  strength: 3,
  text: "I DON'T TRUST HIM, SIRE During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  version: "Royal Vizier",
  willpower: 2,
};
