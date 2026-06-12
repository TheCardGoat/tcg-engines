import type { CharacterCard } from "@tcg/lorcana-types";
import { theColonelOldSheepdogI18n } from "./017-the-colonel-old-sheepdog.i18n";

export const theColonelOldSheepdog: CharacterCard = {
  id: "hQZ",
  canonicalId: "ci_hQZ",
  reprints: ["set8-017"],
  cardType: "character",
  name: "The Colonel",
  version: "Old Sheepdog",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "008",
  cardNumber: 17,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_cddc453bf8734d989b68193f212de440",
    tcgPlayer: 631361,
  },
  text: [
    {
      title: "WE'VE GOT 'EM OUTNUMBERED",
      description:
        "While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Puppy",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 3,
        },
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1r3-1",
      name: "WE'VE GOT 'EM OUTNUMBERED",
      text: "WE'VE GOT 'EM OUTNUMBERED While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.",
      type: "static",
    },
    {
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Puppy",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 3,
        },
      },
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1r3-2",
      name: "WE'VE GOT 'EM OUTNUMBERED",
      text: "WE'VE GOT 'EM OUTNUMBERED While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.",
      type: "static",
    },
  ],
  i18n: theColonelOldSheepdogI18n,
};
