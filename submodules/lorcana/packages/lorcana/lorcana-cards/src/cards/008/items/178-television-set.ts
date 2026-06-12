import type { ItemCard } from "@tcg/lorcana-types";
import { televisionSetI18n } from "./178-television-set.i18n";

export const televisionSet: ItemCard = {
  id: "I9h",
  canonicalId: "ci_I9h",
  reprints: ["set8-178"],
  cardType: "item",
  name: "Television Set",
  inkType: ["sapphire"],
  franchise: "101 Dalmatians",
  set: "008",
  cardNumber: 178,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_133af5231e8e4e3798381e8a03b4ae09",
    tcgPlayer: 631686,
  },
  text: [
    {
      title: "IS IT ON YET?",
      description:
        "{E}, 1 {I} — Look at the top card of your deck. If it's a Puppy character card, you may reveal it and put it into your hand. Otherwise, put it on the bottom of your deck.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "scry",
        amount: 1,
        target: "CONTROLLER",
        revealAll: true,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            filters: [
              { type: "card-type", cardType: "character" },
              { type: "has-classification", classification: "Puppy" },
            ],
          },
          {
            zone: "deck-bottom",
            remainder: true,
          },
        ],
      },
      id: "pbp-1",
      name: "IS IT ON YET?",
      text: "IS IT ON YET? {E}, 1 {I} —  Look at the top card of your deck. If it's a Puppy character card, you may reveal it and put it into your hand. Otherwise, put it on the bottom of your deck.",
      type: "activated",
    },
  ],
  i18n: televisionSetI18n,
};
