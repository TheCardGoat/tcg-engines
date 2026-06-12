import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenConceitedRulerI18n } from "./001-the-queen-conceited-ruler.i18n";
import { support } from "../../../helpers/abilities/support";

export const theQueenConceitedRuler: CharacterCard = {
  id: "5oZ",
  canonicalId: "ci_7pM",
  reprints: ["set9-001"],
  cardType: "character",
  name: "The Queen",
  version: "Conceited Ruler",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "009",
  cardNumber: 1,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_61593ca4abb44723ae95ab9228e27aee",
    tcgPlayer: 650141,
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
  i18n: theQueenConceitedRulerI18n,
};
