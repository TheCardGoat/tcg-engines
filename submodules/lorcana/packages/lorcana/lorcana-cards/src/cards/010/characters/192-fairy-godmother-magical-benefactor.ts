import type { CharacterCard } from "@tcg/lorcana-types";
import { boost } from "../../../helpers/abilities/boost";
import { fairyGodmotherMagicalBenefactorI18n } from "./192-fairy-godmother-magical-benefactor.i18n";

export const fairyGodmotherMagicalBenefactor: CharacterCard = {
  id: "NZ3",
  canonicalId: "ci_NZ3",
  reprints: ["set10-192"],
  cardType: "character",
  name: "Fairy Godmother",
  version: "Magical Benefactor",
  inkType: ["steel"],
  franchise: "Cinderella",
  set: "010",
  cardNumber: 192,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_96d8b0484c8441f0a214eee856f60f35",
    tcgPlayer: 659414,
  },
  text: [
    {
      title: "Boost 3 {I}",
    },
    {
      title: "STUNNING TRANSFORMATION",
      description:
        "Whenever you put a card under this character, you may banish chosen opposing character. If you do, their player may reveal the top card of their deck. If that card is a character or item card, they may play it for free. Otherwise, they put it on the bottom of their deck.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy", "Sorcerer", "Whisper"],
  abilities: [
    boost(3),
    {
      id: "45t-2",
      type: "triggered",
      name: "STUNNING TRANSFORMATION",
      text: "STUNNING TRANSFORMATION Whenever you put a card under this character, you may banish chosen opposing character. If you do, their player may reveal the top card of their deck. If that card is a character or item card, they may play it for free. Otherwise, they put it on the bottom of their deck.",
      trigger: {
        event: "put-card-under",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: {
                selector: "chosen",
                count: 1,
                owner: "opponent",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
            {
              type: "conditional",
              condition: {
                type: "if-you-do",
              },
              then: {
                type: "scry",
                amount: 1,
                target: "OPPONENT",
                chooser: "OPPONENT",
                destinations: [
                  {
                    zone: "play",
                    min: 0,
                    max: 1,
                    cost: "free",
                    reveal: true,
                    filters: [
                      {
                        type: "or",
                        filters: [
                          {
                            type: "card-type",
                            cardType: "character",
                          },
                          {
                            type: "card-type",
                            cardType: "item",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    zone: "deck-bottom",
                    remainder: true,
                  },
                ],
              },
            },
          ],
        },
      },
    },
  ],
  i18n: fairyGodmotherMagicalBenefactorI18n,
};
