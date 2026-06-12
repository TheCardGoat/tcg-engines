import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenDivinerI18n } from "./156-the-queen-diviner.i18n";

export const theQueenDiviner: CharacterCard = {
  id: "7dm",
  canonicalId: "ci_eXi",
  reprints: ["set4-156"],
  cardType: "character",
  name: "The Queen",
  version: "Diviner",
  inkType: ["sapphire"],
  franchise: "Snow White",
  set: "004",
  cardNumber: 156,
  rarity: "legendary",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_20f6a0577b714cf393648a074b1f0bb2",
    tcgPlayer: 550540,
  },
  text: [
    {
      title: "CONSULT THE SPELLBOOK",
      description:
        "{E} — Look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. If that item costs 3 or less, you may play it for free instead and it enters play exerted. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Queen", "Sorcerer"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        type: "scry",
        amount: 4,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "play",
            min: 0,
            max: 1,
            reveal: true,
            cost: "free",
            entersExerted: true,
            filter: {
              type: "card-type",
              cardType: "item",
            },
            playFilters: [
              {
                type: "cost",
                comparison: "lte",
                value: 3,
              },
            ],
            exclusiveGroup: "item-choice",
          },
          {
            zone: "hand",
            min: 0,
            max: 1,
            reveal: true,
            filter: {
              type: "card-type",
              cardType: "item",
            },
            exclusiveGroup: "item-choice",
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
      id: "aeu-1",
      name: "CONSULT THE SPELLBOOK",
      text: "CONSULT THE SPELLBOOK {E} — Look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. If that item costs 3 or less, you may play it for free instead and it enters play exerted. Put the rest on the bottom of your deck in any order.",
      type: "activated",
    },
  ],
  i18n: theQueenDivinerI18n,
};
