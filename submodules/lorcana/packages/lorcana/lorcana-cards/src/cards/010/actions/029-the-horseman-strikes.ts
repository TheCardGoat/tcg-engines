import type { ActionCard } from "@tcg/lorcana-types";
import { theHorsemanStrikesI18n } from "./029-the-horseman-strikes.i18n";

export const theHorsemanStrikes: ActionCard = {
  id: "bIQ",
  canonicalId: "ci_0mj",
  reprints: ["set10-029"],
  cardType: "action",
  name: "The Horseman Strikes!",
  inkType: ["amber"],
  franchise: "Sleepy Hollow",
  set: "010",
  cardNumber: 29,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_faf17cc51b9748daa7187f81103430d0",
    tcgPlayer: 660013,
  },
  text: "Draw a card. You may banish chosen character with Evasive.",
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            chooser: "CONTROLLER",
            effect: {
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
                filter: [
                  {
                    type: "has-keyword",
                    keyword: "Evasive",
                  },
                ],
              },
              type: "banish",
            },
            type: "optional",
          },
        ],
        type: "sequence",
      },
      type: "action",
    },
  ],
  i18n: theHorsemanStrikesI18n,
};
