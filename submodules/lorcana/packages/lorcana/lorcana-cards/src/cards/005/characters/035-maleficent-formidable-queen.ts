import type { CharacterCard } from "@tcg/lorcana-types";
import { maleficentFormidableQueenI18n } from "./035-maleficent-formidable-queen.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const maleficentFormidableQueen: CharacterCard = {
  id: "IEz",
  canonicalId: "ci_IEz",
  reprints: ["set5-035"],
  cardType: "character",
  name: "Maleficent",
  version: "Formidable Queen",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "005",
  cardNumber: 35,
  rarity: "common",
  cost: 8,
  strength: 7,
  willpower: 7,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_d3bfcff390e54c9bbd1027b57320d621",
    tcgPlayer: 561950,
  },
  text: [
    {
      title: "Shift 6",
    },
    {
      title: "LISTEN WELL, ALL OF YOU",
      description:
        "When you play this character, for each of your characters named Maleficent in play, return a chosen opposing character, item, or location with cost 3 or less to their player's hand.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Queen", "Sorcerer"],
  abilities: [
    shift(6),
    {
      effect: {
        type: "for-each",
        counter: {
          type: "target-query",
          query: {
            selector: "all",
            owner: "you",
            zones: ["play"],
            cardType: "character",
            filters: [
              {
                type: "has-name",
                name: "Maleficent",
              },
            ],
          },
        },
        effect: {
          type: "return-to-hand",
          target: {
            cardTypes: ["character", "item", "location"],
            count: 1,
            filter: [
              {
                type: "cost-comparison",
                comparison: "less-or-equal",
                value: 3,
              },
            ],
            owner: "opponent",
            selector: "chosen",
            zones: ["play"],
          },
        },
      },
      id: "1a2-2",
      name: "LISTEN WELL, ALL OF YOU",
      text: "LISTEN WELL, ALL OF YOU When you play this character, for each of your characters named Maleficent in play, return a chosen opposing character, item, or location with cost 3 or less to their player's hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: maleficentFormidableQueenI18n,
};
