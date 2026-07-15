import type { LocationCard } from "@tcg/lorcana-types";
import { arielsGrottoASecretPlaceEnchantedI18n } from "./219-ariels-grotto-a-secret-place-enchanted.i18n";

export const arielsGrottoASecretPlaceEnchanted: LocationCard = {
  id: "nJt",
  canonicalId: "ci_9tr",
  slug: "lorcana-ci_9tr",
  printings: [
    {
      id: "set4-219-enchanted",
      artId: "ci_9tr-enchanted",
      setCode: "set4",
      collectorNumber: "219",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set4-169"],
  cardType: "location",
  name: "Ariel’s Grotto",
  version: "A Secret Place",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 219,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 2,
  willpower: 7,
  moveCost: 2,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_79195cfde0ae4948894c37bef02d9e6f",
    tcgPlayer: "550719",
  },
  text: [
    {
      title: "TREASURE TROVE",
      description: "While you have 3 or more items in play, this location gets +2 {L}.",
    },
  ],
  abilities: [
    {
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "item",
        },
        comparison: {
          operator: "gte",
          value: 3,
        },
      },
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1ca-1",
      name: "TREASURE TROVE",
      text: "TREASURE TROVE While you have 3 or more items in play, this location gets +2 {L}.",
      type: "static",
    },
  ],
  i18n: arielsGrottoASecretPlaceEnchantedI18n,
};
