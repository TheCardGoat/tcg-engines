import type { ItemCard } from "@tcg/lorcana-types";
import { theGlassSlipperEnchantedI18n } from "./208-the-glass-slipper-enchanted.i18n";

export const theGlassSlipperEnchanted: ItemCard = {
  id: "nBf",
  canonicalId: "ci_GJb",
  slug: "lorcana-ci_GJb",
  printings: [
    {
      id: "set7-208-enchanted",
      artId: "ci_GJb-enchanted",
      setCode: "set7",
      collectorNumber: "208",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set7-044"],
  cardType: "item",
  name: "The Glass Slipper",
  inkType: ["amber"],
  franchise: "Cinderella",
  set: "007",
  cardNumber: 208,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cardCopyLimit: 2,
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_aa7db27471b142cfa97cd5ca3409669d",
    tcgPlayer: "619736",
  },
  text: [
    {
      title: "PERFECT PAIR",
      description: "You may only have 2 copies of The Glass Slipper in your deck.",
    },
    {
      title: "SEARCH THE KINGDOM",
      description:
        "Banish this item, {E} one of your Prince characters — Search your deck for a Princess character card and reveal it to all players. Put that card into your hand and shuffle your deck.",
    },
  ],
  abilities: [
    {
      id: "j91-1",
      name: "SEARCH THE KINGDOM",
      type: "activated",
      cost: {
        banishSelf: true,
        exertCharacters: 1,
        exertCharactersClassification: "Prince",
      },
      effect: {
        type: "search-deck",
        cardType: "character",
        classification: "Princess",
        putInto: "hand",
        reveal: true,
        shuffle: true,
      },
      text: "SEARCH THE KINGDOM Banish this item, {E} one of your Prince characters — Search your deck for a Princess character card and reveal it to all players. Put that card into your hand and shuffle your deck.",
    },
  ],
  i18n: theGlassSlipperEnchantedI18n,
};
