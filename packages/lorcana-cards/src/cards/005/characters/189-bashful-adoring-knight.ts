import type { CharacterCard } from "@tcg/lorcana-types";

export const bashfulAdoringKnight: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Bodyguard",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "gwv-1",
      text: "IMPRESS THE PRINCESS While you have a character named Snow White in play, this character gains Bodyguard.",
      type: "action",
    },
  ],
  cardNumber: 189,
  cardType: "character",
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
  cost: 4,
  externalIds: {
    ravensburger: "3cf4b19a2648e56f2b033173866e792f12a00589",
  },
  franchise: "Snow White",
  fullName: "Bashful - Adoring Knight",
  id: "gwv",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Bashful",
  set: "005",
  strength: 3,
  text: "IMPRESS THE PRINCESS While you have a character named Snow White in play, this character gains Bodyguard. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  version: "Adoring Knight",
  willpower: 4,
};
