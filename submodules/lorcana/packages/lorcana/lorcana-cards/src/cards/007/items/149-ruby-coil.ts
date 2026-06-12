import type { ItemCard } from "@tcg/lorcana-types";
import { rubyCoilI18n } from "./149-ruby-coil.i18n";

export const rubyCoil: ItemCard = {
  id: "Twc",
  canonicalId: "ci_Twc",
  reprints: ["set7-149"],
  cardType: "item",
  name: "Ruby Coil",
  inkType: ["ruby"],
  franchise: "Lorcana",
  set: "007",
  cardNumber: 149,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9d23dd955ab74137bba7be82615b2178",
    tcgPlayer: 619492,
  },
  text: [
    {
      title: "CRIMSON SPARK",
      description:
        "During your turn, whenever a card is put into your inkwell, chosen character gets +2 {S} this turn.",
    },
  ],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "1mn-1",
      name: "CRIMSON SPARK",
      text: "CRIMSON SPARK During your turn, whenever a card is put into your inkwell, chosen character gets +2 {S} this turn.",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: rubyCoilI18n,
};
