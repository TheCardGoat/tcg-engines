import type { CharacterCard } from "@tcg/lorcana-types";
import { moanaSelftaughtSailorI18n } from "./117-moana-self-taught-sailor.i18n";

export const moanaSelftaughtSailor: CharacterCard = {
  id: "DbC",
  canonicalId: "ci_DbC",
  reprints: ["set6-117"],
  cardType: "character",
  name: "Moana",
  version: "Self-Taught Sailor",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "006",
  cardNumber: 117,
  rarity: "common",
  cost: 1,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_772912bd2bb0469890adfcc1b3eedd61",
    tcgPlayer: 591990,
  },
  text: [
    {
      title: "LEARNING THE ROPES",
      description: "This character can't challenge unless you have a Captain character in play.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess", "Pirate"],
  abilities: [
    {
      condition: {
        type: "not",
        condition: {
          type: "has-character-with-classification",
          classification: "Captain",
          controller: "you",
        },
      },
      effect: {
        restriction: "cant-challenge",
        target: "SELF",
        type: "restriction",
      },
      id: "13o-1",
      name: "LEARNING THE ROPES",
      text: "LEARNING THE ROPES This character can't challenge unless you have a Captain character in play.",
      type: "static",
    },
  ],
  i18n: moanaSelftaughtSailorI18n,
};
