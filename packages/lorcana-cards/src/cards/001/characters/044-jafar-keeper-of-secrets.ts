import type { CharacterCard } from "@tcg/lorcana-types/cards/card-types";

export const jafar: CharacterCard = {
  id: "rau",
  cardType: "character",
  name: "Jafar",
  version: "Keeper of Secrets",
  fullName: "Jafar - Keeper of Secrets",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "001",
  text: "**HIDDEN WONDERS** This character gets +1 {S} for each card in your hand.",
  cost: 4,
  strength: 0,
  willpower: 5,
  lore: 2,
  cardNumber: 44,
  inkable: true,
  rarity: "rare",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 507719,
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
      name: "Hidden Wonders",
      id: "rau-1",
      text: "This character gets +1 {S} for each card in your hand.",
    },
  ],
};
