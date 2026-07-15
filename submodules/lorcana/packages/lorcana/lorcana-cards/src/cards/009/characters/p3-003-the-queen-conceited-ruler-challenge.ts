import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenConceitedRulerP3ChallengeI18n } from "./p3-003-the-queen-conceited-ruler-challenge.i18n";

import { support } from "../../../helpers/abilities/support";

export const theQueenConceitedRulerP3Challenge: CharacterCard = {
  id: "Gp0",
  canonicalId: "ci_nPF",
  slug: "lorcana-ci_nPF",
  printings: [
    {
      id: "set9-p3-003-challenge",
      artId: "ci_nPF-challenge",
      setCode: "set9",
      collectorNumber: "3",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set9-001"],
  cardType: "character",
  name: "The Queen",
  version: "Conceited Ruler",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "009",
  cardNumber: 3,
  rarity: "special",
  specialRarity: "challenge",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_61593ca4abb44723ae95ab9228e27aee",
    tcgPlayer: "650141",
  },
  text: [
    {
      title: "Support",
    },
    {
      title: "ROYAL SUMMONS",
      description:
        "At the start of your turn, you may choose and discard a Princess or Queen character card to return a character card from your discard to your hand.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
  abilities: [
    support,
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              type: "discard",
              amount: 1,
              chosen: true,
              target: "CONTROLLER",
              from: "hand",
              filter: {
                cardType: "character",
              },
              filters: [
                {
                  type: "or",
                  filters: [
                    {
                      type: "has-classification",
                      classification: "Princess",
                    },
                    {
                      type: "has-classification",
                      classification: "Queen",
                    },
                  ],
                },
              ],
            },
            {
              cardType: "character",
              target: "CONTROLLER",
              type: "return-from-discard",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      id: "3l5-2",
      name: "ROYAL SUMMONS",
      text: "ROYAL SUMMONS At the start of your turn, you may choose and discard a Princess or Queen character card to return a character card from your discard to your hand.",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      type: "triggered",
    },
  ],
  i18n: theQueenConceitedRulerP3ChallengeI18n,
};
