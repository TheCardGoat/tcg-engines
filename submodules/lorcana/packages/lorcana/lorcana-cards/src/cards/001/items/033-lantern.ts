import type { ItemCard } from "@tcg/lorcana-types";
import { lanternI18n } from "./033-lantern.i18n";

export const lantern: ItemCard = {
  id: "Dig",
  canonicalId: "ci_38Q",
  reprints: ["set1-033", "set9-032"],
  cardType: "item",
  name: "Lantern",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "001",
  cardNumber: 33,
  rarity: "rare",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_c77ef321da53426c9f7d856202152b2e",
    tcgPlayer: 649979,
  },
  text: [
    {
      title: "BIRTHDAY LIGHTS",
      description: "{E} — You pay 1 {I} less for the next character you play this turn.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        cardType: "character",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "o5u-1",
      name: "BIRTHDAY LIGHTS",
      text: "BIRTHDAY LIGHTS {E} — You pay 1 {I} less for the next character you play this turn.",
      type: "activated",
    },
  ],
  i18n: lanternI18n,
};
