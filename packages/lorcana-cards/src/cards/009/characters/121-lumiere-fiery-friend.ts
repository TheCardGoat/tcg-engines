import type { CharacterCard } from "@tcg/lorcana-types";

export const lumiereFieryFriend: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "YOUR_CHARACTERS",
        type: "modify-stat",
      },
      id: "xyr-1",
      name: "FERVENT ADDRESS Your other",
      text: "FERVENT ADDRESS Your other characters get +1 {S}.",
      type: "static",
    },
  ],
  cardNumber: 121,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "7a69f5139f712cc9898120eee5736b7a23f360ca",
  },
  franchise: "Beauty and the Beast",
  fullName: "Lumiere - Fiery Friend",
  id: "xyr",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Lumiere",
  set: "009",
  strength: 2,
  text: "FERVENT ADDRESS Your other characters get +1 {S}.",
  version: "Fiery Friend",
  willpower: 2,
};
