import type { ItemCard } from "@tcg/lorcana-types";
import { heartOfTeFitiI18n } from "./168-heart-of-te-fiti.i18n";

export const heartOfTeFiti: ItemCard = {
  id: "EMW",
  canonicalId: "ci_bK7",
  slug: "lorcana-ci_bK7",
  printings: [
    {
      id: "set9-168",
      artId: "set9-168",
      setCode: "set9",
      collectorNumber: "168",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set3-164", "set9-168"],
  cardType: "item",
  name: "Heart of Te Fiti",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "009",
  cardNumber: 168,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_81cea9b9222c496a8de13d5eb3215ab2",
    tcgPlayer: "650102",
  },
  text: [
    {
      title: "CREATE LIFE",
      description:
        "{E}, 2 {I} — Put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        exerted: true,
        facedown: true,
        source: "top-of-deck",
        target: "CONTROLLER",
        type: "put-into-inkwell",
      },
      id: "1vi-1",
      name: "CREATE LIFE",
      text: "CREATE LIFE {E}, 2 {I} — Put the top card of your deck into your inkwell facedown and exerted.",
      type: "activated",
    },
  ],
  i18n: heartOfTeFitiI18n,
};
