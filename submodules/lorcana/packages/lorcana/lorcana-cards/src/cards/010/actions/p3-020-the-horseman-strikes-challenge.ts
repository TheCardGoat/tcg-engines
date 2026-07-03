import type { ActionCard } from "@tcg/lorcana-types";
import { theHorsemanStrikesP3ChallengeI18n } from "./p3-020-the-horseman-strikes-challenge.i18n";

export const theHorsemanStrikesP3Challenge: ActionCard = {
  id: "pIG",
  canonicalId: "ci_rO0",
  slug: "lorcana-ci_rO0",
  printings: [
    {
      id: "set10-p3-020-challenge",
      artId: "ci_rO0-challenge",
      setCode: "set10",
      collectorNumber: "20",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set10-029"],
  cardType: "action",
  name: "The Horseman Strikes!",
  inkType: ["amber"],
  franchise: "Sleepy Hollow",
  set: "010",
  cardNumber: 20,
  rarity: "special",
  specialRarity: "challenge",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_faf17cc51b9748daa7187f81103430d0",
    tcgPlayer: "660013",
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
  i18n: theHorsemanStrikesP3ChallengeI18n,
};
