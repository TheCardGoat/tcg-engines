import type { CharacterCard } from "@tcg/lorcana-types";
import { madDogKarnagesFirstMateI18n } from "./093-mad-dog-karnages-first-mate.i18n";

export const madDogKarnagesFirstMate: CharacterCard = {
  id: "rMw",
  canonicalId: "ci_rMw",
  reprints: ["set8-093"],
  cardType: "character",
  name: "Mad Dog",
  version: "Karnage's First Mate",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "008",
  cardNumber: 93,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a48e0fd953434daa8315590258fe62a6",
    tcgPlayer: 631680,
  },
  text: [
    {
      title: "ARE YOU SURE THIS IS SAFE, CAPTAIN?",
      description:
        "If you have a character named Don Karnage in play, you pay 1 {I} less to play this character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Pirate"],
  abilities: [
    {
      id: "19p-1",
      name: "ARE YOU SURE THIS IS SAFE, CAPTAIN?",
      text: "ARE YOU SURE THIS IS SAFE, CAPTAIN? If you have a character named Don Karnage in play, you pay 1 {I} less to play this character.",
      type: "static",
      sourceZones: ["hand"],
      effect: {
        type: "cost-reduction",
        amount: {
          type: "clamp",
          value: {
            type: "filtered-count",
            owner: "you",
            zones: ["play"],
            cardType: "character",
            filters: [
              {
                type: "has-name",
                name: "Don Karnage",
              },
            ],
          },
          max: 1,
        },
        cardType: "character",
      },
    },
  ],
  i18n: madDogKarnagesFirstMateI18n,
};
