import type { CharacterCard } from "@tcg/lorcana-types";
import { jafarKeeperOfSecretsI18n } from "./038-jafar-keeper-of-secrets.i18n";

export const jafarKeeperOfSecrets: CharacterCard = {
  id: "khp",
  canonicalId: "ci_2bv",
  slug: "lorcana-ci_2bv",
  printings: [
    {
      id: "set9-038",
      artId: "set9-038",
      setCode: "set9",
      collectorNumber: "38",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set1-044", "set9-038"],
  cardType: "character",
  name: "Jafar",
  version: "Keeper of Secrets",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "009",
  cardNumber: 38,
  rarity: "rare",
  cost: 4,
  strength: 0,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_2f69538767394390bc91d25fd5948a5b",
    tcgPlayer: "649985",
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
