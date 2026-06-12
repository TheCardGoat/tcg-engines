import type { ItemCard } from "@tcg/lorcana-types";
import { poisonedAppleI18n } from "./134-poisoned-apple.i18n";

export const poisonedApple: ItemCard = {
  id: "NVz",
  canonicalId: "ci_NVz",
  reprints: ["set1-134"],
  cardType: "item",
  name: "Poisoned Apple",
  inkType: ["ruby"],
  franchise: "Snow White",
  set: "001",
  cardNumber: 134,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_3c0355d3cc2d409e9b10876744aa534a",
    tcgPlayer: 507862,
  },
  text: [
    {
      title: "TAKE A BITE... 1",
      description:
        "{I}, Banish this item — Exert chosen character. If a Princess character is chosen, banish her instead.",
    },
  ],
  abilities: [
    {
      cost: {
        ink: 1,
        banishSelf: true,
      },
      effect: {
        type: "conditional",
        condition: {
          type: "target-query",
          query: {
            selector: "all",
            reference: "selected-first",
            filters: [
              {
                type: "card-type",
                value: "character",
              },
              {
                type: "has-classification",
                classification: "Princess",
              },
            ],
          },
          comparison: {
            operator: "gte",
            value: 1,
          },
        },
        then: {
          target: "CHOSEN_CHARACTER",
          type: "banish",
        },
        else: {
          target: "CHOSEN_CHARACTER",
          type: "exert",
        },
      },
      id: "1mn-1",
      name: "TAKE A BITE... 1",
      text: "TAKE A BITE... 1 {I}, Banish this item — Exert chosen character. If a Princess character is chosen, banish her instead.",
      type: "activated",
    },
  ],
  i18n: poisonedAppleI18n,
};
