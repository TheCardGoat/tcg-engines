import type { ItemCard } from "@tcg/lorcana-types";
import { theBlackCauldronEnchantedI18n } from "./225-the-black-cauldron-enchanted.i18n";

export const theBlackCauldronEnchanted: ItemCard = {
  id: "YW5",
  canonicalId: "ci_uoZ",
  slug: "lorcana-ci_uoZ",
  printings: [
    {
      id: "set10-225-enchanted",
      artId: "ci_uoZ-enchanted",
      setCode: "set10",
      collectorNumber: "225",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set10-032"],
  cardType: "item",
  name: "The Black Cauldron",
  inkType: ["amber"],
  franchise: "Black Cauldron",
  set: "010",
  cardNumber: 225,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_24dfd54db49e4a5d8004c51d0882aa46",
    tcgPlayer: "658884",
  },
  text: [
    {
      title: "THE CAULDRON CALLS",
      description: "{E}, 1 {I} — Put a character card from your discard under this item faceup.",
    },
    {
      title: "RISE AND JOIN ME!",
      description: "{E}, 1 {I} — This turn, you may play characters from under this item.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        source: "discard",
        type: "put-under",
        under: "self",
        cardType: "character",
        faceup: true,
      },
      id: "4V4-1",
      name: "THE CAULDRON CALLS",
      text: "THE CAULDRON CALLS {E}, 1 {I} — Put a character card from your discard under this item faceup.",
      type: "activated",
    },
    {
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "enable-play-from-under",
        duration: "this-turn",
        cardType: "character",
      },
      id: "4V4-2",
      name: "RISE AND JOIN ME!",
      text: "RISE AND JOIN ME! {E}, 1 {I} — This turn, you may play characters from under this item.",
      type: "activated",
    },
  ],
  i18n: theBlackCauldronEnchantedI18n,
};
