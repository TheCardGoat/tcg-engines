import type { CharacterCard } from "@tcg/lorcana-types";
import { plutoCleverCluefinderI18n } from "./157-pluto-clever-cluefinder.i18n";

export const plutoCleverCluefinder: CharacterCard = {
  id: "6GN",
  canonicalId: "ci_6GN",
  reprints: ["set10-157"],
  cardType: "character",
  name: "Pluto",
  version: "Clever Cluefinder",
  inkType: ["sapphire"],
  set: "010",
  cardNumber: 157,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_bfdd0f1b2c564334afb8ee438ebd677e",
    tcgPlayer: 659385,
  },
  text: [
    {
      title: "ON THE TRAIL",
      description:
        "{E} — If you have a Detective character in play, return an item card from your discard to your hand. Otherwise, put it on the top of your deck.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        condition: {
          type: "has-character-with-classification",
          classification: "Detective",
          controller: "you",
        },
        then: {
          cardType: "item",
          destination: "hand",
          target: "CONTROLLER",
          type: "return-from-discard",
        },
        else: {
          cardType: "item",
          destination: "top-of-deck",
          target: "CONTROLLER",
          type: "return-from-discard",
        },
        type: "conditional",
      },
      id: "cpr-1",
      name: "ON THE TRAIL",
      text: "ON THE TRAIL {E} — If you have a Detective character in play, return an item card from your discard to your hand. Otherwise, put it on the top of your deck.",
      type: "activated",
    },
  ],
  i18n: plutoCleverCluefinderI18n,
};
