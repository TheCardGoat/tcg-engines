import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenDisguisedPeddlerI18n } from "./093-the-queen-disguised-peddler.i18n";

export const theQueenDisguisedPeddler: CharacterCard = {
  id: "zX1",
  canonicalId: "ci_zX1",
  reprints: ["set2-093"],
  cardType: "character",
  name: "The Queen",
  version: "Disguised Peddler",
  inkType: ["emerald"],
  franchise: "Snow White",
  set: "002",
  cardNumber: 93,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 0,
  inkable: false,
  externalIds: {
    lorcast: "crd_6cdb5c7da33a4158b6646d784ec0f2d5",
    tcgPlayer: 527273,
  },
  text: [
    {
      title: "A PERFECT DISGUISE",
      description:
        "{E}, Choose and discard a character card — Gain lore equal to the discarded character's {L}.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen"],
  abilities: [
    {
      id: "j1t-1",
      name: "A PERFECT DISGUISE",
      text: "A PERFECT DISGUISE {E}, Choose and discard a character card — Gain lore equal to the discarded character's {L}.",
      type: "activated",
      cost: {
        exert: true,
        discardCards: 1,
        discardChosen: true,
        discardCardType: "character",
      },
      effect: {
        amount: "DISCARDED_CARD_LORE",
        type: "gain-lore",
      },
    },
  ],
  i18n: theQueenDisguisedPeddlerI18n,
};
