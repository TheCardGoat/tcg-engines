import type { ItemCard } from "@tcg/lorcana-types";
import { theSorcerersHatEnchantedI18n } from "./210-the-sorcerers-hat-enchanted.i18n";

export const theSorcerersHatEnchanted: ItemCard = {
  id: "kFP",
  canonicalId: "ci_4Wb",
  slug: "lorcana-ci_4Wb",
  printings: [
    {
      id: "set3-210-enchanted",
      artId: "ci_4Wb-enchanted",
      setCode: "set3",
      collectorNumber: "210",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set3-065"],
  cardType: "item",
  name: "The Sorcerer's Hat",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "003",
  cardNumber: 210,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5a2ba6e63b07496d96a17d2565b2a1db",
    tcgPlayer: "539162",
  },
  text: [
    {
      title: "INCREDIBLE ENERGY",
      description:
        "{E}, 1 {I} — Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand. Otherwise, put it on the top of your deck.",
    },
  ],
  abilities: [
    {
      id: "geu-1",
      name: "INCREDIBLE ENERGY",
      text: "INCREDIBLE ENERGY {E}, 1 {I} — Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand. Otherwise, put it on the top of your deck.",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "name-a-card",
          },
          {
            type: "reveal-and-route",
            target: "CONTROLLER",
            routes: [
              {
                condition: {
                  type: "revealed-matches-named",
                },
                destination: {
                  zone: "hand",
                },
              },
            ],
            fallback: {
              zone: "deck-top",
            },
          },
        ],
      },
    },
  ],
  i18n: theSorcerersHatEnchantedI18n,
};
