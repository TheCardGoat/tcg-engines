import type { ItemCard } from "@tcg/lorcana-types";
import { amazusInkcasterI18n } from "./134-amazus-inkcaster.i18n";

export const amazusInkcaster: ItemCard = {
  id: "fvP",
  canonicalId: "ci_fvP",
  reprints: ["set12-134"],
  cardType: "item",
  name: "Amazu's Inkcaster",
  inkType: ["ruby"],
  franchise: "Lorcana",
  set: "012",
  cardNumber: 134,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_30c8fa2e8ce74eda9ca073a92c353b43",
  },
  text: [
    {
      title: "ON THE HORIZON",
      description:
        "{E}, 1 {I} — Look at the top 4 cards of your deck. You may reveal a location card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  abilities: [
    {
      id: "fvP-1",
      name: "ON THE HORIZON",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "scry",
        amount: 4,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            reveal: true,
            filter: {
              type: "card-type",
              cardType: "location",
            },
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      text: "ON THE HORIZON {E}, 1 {I} — Look at the top 4 cards of your deck. You may reveal a location card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  i18n: amazusInkcasterI18n,
};
