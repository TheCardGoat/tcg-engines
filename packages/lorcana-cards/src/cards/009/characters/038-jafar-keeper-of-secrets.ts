import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarKeeperOfSecrets: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1u7-1",
      text: "HIDDEN WONDERS This character gets +1 {S} for each card in your hand.",
      type: "static",
    },
  ],
  cardNumber: 38,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "ee9d82aaf3c52ce93cf24d12435b7bbf781da971",
  },
  franchise: "Aladdin",
  fullName: "Jafar - Keeper of Secrets",
  id: "1u7",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Jafar",
  set: "009",
  strength: 0,
  text: "HIDDEN WONDERS This character gets +1 {S} for each card in your hand.",
  version: "Keeper of Secrets",
  willpower: 5,
};
