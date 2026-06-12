import type { CharacterCard } from "@tcg/lorcana-types";
import { jafarKeeperOfSecretsI18n } from "./044-jafar-keeper-of-secrets.i18n";

export const jafarKeeperOfSecrets: CharacterCard = {
  id: "vm4",
  canonicalId: "ci_2bv",
  reprints: ["set1-044", "set9-038"],
  cardType: "character",
  name: "Jafar",
  version: "Keeper of Secrets",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "001",
  cardNumber: 44,
  rarity: "rare",
  cost: 4,
  strength: 0,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_2f69538767394390bc91d25fd5948a5b",
    tcgPlayer: 649985,
  },
  text: [
    {
      title: "HIDDEN WONDERS",
      description: "This character gets +1 {S} for each card in your hand.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  abilities: [
    {
      effect: {
        modifier: {
          type: "cards-in-hand",
          controller: "you",
        },
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1u7-1",
      name: "HIDDEN WONDERS",
      text: "HIDDEN WONDERS This character gets +1 {S} for each card in your hand.",
      type: "static",
    },
  ],
  i18n: jafarKeeperOfSecretsI18n,
};
