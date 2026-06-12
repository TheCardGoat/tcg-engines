import type { CharacterCard } from "@tcg/lorcana-types";
import { diabloStoneServantI18n } from "./196-diablo-stone-servant.i18n";

export const diabloStoneServant: CharacterCard = {
  id: "1XC",
  canonicalId: "ci_1XC",
  reprints: ["set12-196"],
  cardType: "character",
  name: "Diablo",
  version: "Stone Servant",
  inkType: ["steel"],
  franchise: "Sleeping Beauty",
  set: "012",
  cardNumber: 196,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3b6a0713a14849bd9a660f147308111d",
  },
  text: [
    {
      title: "CRUEL INTENT",
      description:
        "While you have a Villain character in play, this character gets +2 {S} and +1 {L}.",
    },
    {
      title: "VILLAINOUS BOND",
      description: "While this character is exerted, your Villain characters can't be challenged.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      id: "1XC-1a",
      name: "CRUEL INTENT",
      type: "static",
      text: "CRUEL INTENT While you have a Villain character in play, this character gets +2 {S} and +1 {L}.",
      condition: {
        type: "has-character-count",
        controller: "you",
        comparison: "greater-or-equal",
        count: 1,
        classification: "Villain",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
    },
    {
      id: "1XC-1b",
      name: "CRUEL INTENT",
      type: "static",
      text: "CRUEL INTENT While you have a Villain character in play, this character gets +2 {S} and +1 {L}.",
      condition: {
        type: "has-character-count",
        controller: "you",
        comparison: "greater-or-equal",
        count: 1,
        classification: "Villain",
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
    },
    {
      id: "1XC-2",
      name: "VILLAINOUS BOND",
      type: "static",
      text: "VILLAINOUS BOND While this character is exerted, your Villain characters can't be challenged.",
      condition: {
        type: "is-exerted",
      },
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Villain",
            },
          ],
        },
      },
    },
  ],
  i18n: diabloStoneServantI18n,
};
