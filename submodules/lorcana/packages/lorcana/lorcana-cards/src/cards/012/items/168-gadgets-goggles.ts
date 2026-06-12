import type { ItemCard } from "@tcg/lorcana-types";
import { gadgetsGogglesI18n } from "./168-gadgets-goggles.i18n";

export const gadgetsGoggles: ItemCard = {
  id: "rir",
  canonicalId: "ci_rir",
  reprints: ["set12-168"],
  cardType: "item",
  name: "Gadget's Goggles",
  inkType: ["sapphire"],
  franchise: "Rescue Rangers",
  set: "012",
  cardNumber: 168,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c73f177d87004136ab148a91b23a1308",
  },
  text: [
    {
      title: "ENHANCED VISION",
      description:
        "{E}, 1 {I} — Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
    },
  ],
  abilities: [
    {
      id: "rir-1",
      name: "ENHANCED VISION",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "scry",
        amount: 2,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "deck-top",
            min: 1,
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
          },
        ],
      },
      text: "ENHANCED VISION {E}, 1 {I} — Look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.",
    },
  ],
  i18n: gadgetsGogglesI18n,
};
