import type { CharacterCard } from "@tcg/lorcana-types";
import { scroogeMcduckGhostlyEbenezerI18n } from "./104-scrooge-mcduck-ghostly-ebenezer.i18n";
import { boost } from "../../../helpers/abilities/boost";

export const scroogeMcduckGhostlyEbenezer: CharacterCard = {
  id: "cXq",
  canonicalId: "ci_cXq",
  reprints: ["set11-104"],
  cardType: "character",
  name: "Scrooge McDuck",
  version: "Ghostly Ebenezer",
  inkType: ["ruby"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 104,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_4209198480ed495d9d5ed7608ece035f",
    tcgPlayer: 676209,
  },
  text: [
    {
      title: "Boost 1 {I}",
    },
    {
      title: "COUNTING COINS",
      description: "This character gets +1 {S} and +1 {W} for each card under him.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Ghost"],
  abilities: [
    boost(1),
    {
      id: "11x-2",
      name: "COUNTING COINS",
      type: "static",
      effect: {
        type: "modify-stat",
        target: "SELF",
        stat: "strength",
        modifier: {
          type: "cards-under-self",
        },
      },
      text: "COUNTING COINS This character gets +1 {S} and +1 {W} for each card under him.",
    },
    {
      id: "11x-3",
      name: "COUNTING COINS",
      type: "static",
      effect: {
        type: "modify-stat",
        target: "SELF",
        stat: "willpower",
        modifier: {
          type: "cards-under-self",
        },
      },
      text: "COUNTING COINS This character gets +1 {S} and +1 {W} for each card under him.",
    },
  ],
  i18n: scroogeMcduckGhostlyEbenezerI18n,
};
