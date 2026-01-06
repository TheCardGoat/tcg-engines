import type { CharacterCard } from "@tcg/lorcana-types/cards/card-types";

export const jafar: CharacterCard = {
  id: "fh0",
  cardType: "character",
  name: "Jafar",
  version: "Wicked Sorcerer",
  fullName: "Jafar - Wicked Sorcerer",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "001",
  text: "**Challenger** +3 (_When challenging, this character get +3 {S}._)",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 45,
  inkable: true,
  rarity: "common",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 494098,
  },
  classifications: ["Dreamborn", "Sorcerer", "Villain"],
  abilities: [
    {
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-sing",
        target: "SELF",
      },
      id: "fh0-1",
      text: "**Challenger** +3 (_When challenging, this character get +3 {S}._)",
    },
  ],
};
