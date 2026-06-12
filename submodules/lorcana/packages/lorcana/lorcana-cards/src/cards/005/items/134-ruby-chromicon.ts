import type { ItemCard } from "@tcg/lorcana-types";
import { rubyChromiconI18n } from "./134-ruby-chromicon.i18n";

export const rubyChromicon: ItemCard = {
  id: "RCb",
  canonicalId: "ci_RCb",
  reprints: ["set5-134"],
  cardType: "item",
  name: "Ruby Chromicon",
  inkType: ["ruby"],
  franchise: "Lorcana",
  set: "005",
  cardNumber: 134,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_414acca972834b90bd464855d69b79cf",
    tcgPlayer: 560100,
  },
  text: [
    {
      title: "RUBY LIGHT",
      description: "{E} — Chosen character gets +1 {S} this turn.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "1tf-1",
      name: "RUBY LIGHT",
      text: "RUBY LIGHT {E} — Chosen character gets +1 {S} this turn.",
      type: "activated",
    },
  ],
  i18n: rubyChromiconI18n,
};
