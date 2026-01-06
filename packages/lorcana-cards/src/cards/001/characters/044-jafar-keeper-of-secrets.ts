import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarKeeperOfSecrets: CharacterCard = {
  id: "rau",
  cardType: "character",
  name: "Jafar",
  version: "Keeper of Secrets",
  fullName: "Jafar - Keeper of Secrets",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**HIDDEN WONDERS** This character gets +1 {S} for each card in your hand.",
  cost: 4,
  strength: 0,
  willpower: 5,
  lore: 2,
  cardNumber: 44,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**HIDDEN WONDERS** This character gets +1 {S} for each card in your hand.",
      id: "rau-1",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
    },
  ],
  classifications: ["Dreamborn", "Sorcerer", "Villain"],
};
