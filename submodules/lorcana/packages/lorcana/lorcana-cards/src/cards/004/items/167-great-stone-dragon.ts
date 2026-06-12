import type { ItemCard } from "@tcg/lorcana-types";
import { greatStoneDragonI18n } from "./167-great-stone-dragon.i18n";

export const greatStoneDragon: ItemCard = {
  id: "BvX",
  canonicalId: "ci_BvX",
  reprints: ["set4-167"],
  cardType: "item",
  name: "Great Stone Dragon",
  inkType: ["sapphire"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 167,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_11587e02677148c28e30eeaa164a2569",
    tcgPlayer: 549341,
  },
  text: [
    {
      title: "ASLEEP",
      description: "This item enters play exerted.",
    },
    {
      title: "AWAKEN",
      description:
        "{E} — Put a character card from your discard into your inkwell facedown and exerted.",
    },
  ],
  abilities: [
    {
      effect: {
        restriction: "enters-play-exerted",
        target: "SELF",
        type: "restriction",
      },
      id: "19h-1",
      name: "ASLEEP",
      text: "ASLEEP This item enters play exerted.",
      type: "static",
    },
    {
      cost: {
        exert: true,
      },
      effect: {
        exerted: true,
        facedown: true,
        source: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["discard"],
          cardTypes: ["character"],
        },
        target: "CONTROLLER",
        type: "put-into-inkwell",
      },
      id: "19h-2",
      name: "AWAKEN",
      text: "AWAKEN {E} — Put a character card from your discard into your inkwell facedown and exerted.",
      type: "activated",
    },
  ],
  i18n: greatStoneDragonI18n,
};
