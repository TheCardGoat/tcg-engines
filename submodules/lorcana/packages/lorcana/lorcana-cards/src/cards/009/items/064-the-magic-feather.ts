import type { ItemCard } from "@tcg/lorcana-types";
import { theMagicFeatherI18n } from "./064-the-magic-feather.i18n";

export const theMagicFeather: ItemCard = {
  id: "sHD",
  canonicalId: "ci_sHD",
  reprints: ["set9-064"],
  cardType: "item",
  name: "The Magic Feather",
  inkType: ["amethyst"],
  franchise: "Dumbo",
  set: "009",
  cardNumber: 64,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_34d603519eae499991189bf1efc0207c",
    tcgPlayer: 647677,
  },
  text: [
    {
      title: "NOW YOU CAN FLY!",
      description:
        "When you play this item, choose a character of yours. While this item is in play, that character gains Evasive.",
    },
    {
      title: "GROUNDED 3",
      description: "{I} — Return this item to your hand.",
    },
  ],
  abilities: [
    {
      effect: {
        duration: "while-in-play",
        keyword: "Evasive",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "you",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "cfx-1",
      name: "NOW YOU CAN FLY!",
      text: "NOW YOU CAN FLY! When you play this item, choose a character of yours. While this item is in play, that character gains Evasive.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      cost: {
        ink: 3,
      },
      effect: {
        target: {
          cardTypes: ["item"],
          count: 1,
          owner: "you",
          selector: "self",
          zones: ["play"],
        },
        type: "return-to-hand",
      },
      id: "cfx-2",
      name: "GROUNDED 3",
      text: "GROUNDED 3 {I} — Return this item to your hand.",
      type: "activated",
    },
  ],
  i18n: theMagicFeatherI18n,
};
