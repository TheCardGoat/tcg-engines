import type { ItemCard } from "@tcg/lorcana-types";
import { scarabI18n } from "./083-scarab.i18n";

export const scarab: ItemCard = {
  id: "wF1",
  canonicalId: "ci_wF1",
  reprints: ["set8-083"],
  cardType: "item",
  name: "Scarab",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "008",
  cardNumber: 83,
  rarity: "common",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_ae421dc6240c4060ae788fa48c5aa487",
    tcgPlayer: 631404,
  },
  text: [
    {
      title: "SEARCH THE SANDS",
      description: "{E} 2 {I} — Return an Illusion character card from your discard to your hand.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        cardType: "character",
        filter: {
          type: "has-classification",
          classification: "Illusion",
        },
        target: "CONTROLLER",
        type: "return-from-discard",
      },
      id: "1wa-1",
      name: "SEARCH THE SANDS",
      text: "SEARCH THE SANDS {E} 2 {I} – Return an Illusion character card from your discard to your hand.",
      type: "activated",
    },
  ],
  i18n: scarabI18n,
};
