import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarKeeperOfSecrets: CharacterCard = {
  id: "1u7",
  cardType: "character",
  name: "Jafar",
  version: "Keeper of Secrets",
  fullName: "Jafar - Keeper of Secrets",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "009",
  text: "HIDDEN WONDERS This character gets +1 {S} for each card in your hand.",
  cost: 4,
  strength: 0,
  willpower: 5,
  lore: 2,
  cardNumber: 38,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ee9d82aaf3c52ce93cf24d12435b7bbf781da971",
  },
  abilities: [
    {
      id: "1u7-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
      text: "HIDDEN WONDERS This character gets +1 {S} for each card in your hand.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};
