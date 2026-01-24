import type { CharacterCard } from "@tcg/lorcana-types";

export const lumiereFieryFriend: CharacterCard = {
  id: "xyr",
  cardType: "character",
  name: "Lumiere",
  version: "Fiery Friend",
  fullName: "Lumiere - Fiery Friend",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "009",
  text: "FERVENT ADDRESS Your other characters get +1 {S}.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 121,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7a69f5139f712cc9898120eee5736b7a23f360ca",
  },
  abilities: [
    {
      id: "xyr-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "YOUR_CHARACTERS",
      },
      name: "FERVENT ADDRESS Your other",
      text: "FERVENT ADDRESS Your other characters get +1 {S}.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
