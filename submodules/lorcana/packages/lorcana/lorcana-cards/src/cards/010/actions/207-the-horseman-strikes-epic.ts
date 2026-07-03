import type { ActionCard } from "@tcg/lorcana-types";
import { theHorsemanStrikesEpicI18n } from "./207-the-horseman-strikes-epic.i18n";

export const theHorsemanStrikesEpic: ActionCard = {
  id: "9k2",
  canonicalId: "ci_rO0",
  slug: "lorcana-ci_rO0",
  printings: [
    {
      id: "set10-207-epic",
      artId: "ci_rO0-epic",
      setCode: "set10",
      collectorNumber: "207",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set10-029"],
  cardType: "action",
  name: "The Horseman Strikes!",
  inkType: ["amber"],
  franchise: "Sleepy Hollow",
  set: "010",
  cardNumber: 207,
  rarity: "common",
  specialRarity: "epic",
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
  i18n: theHorsemanStrikesEpicI18n,
};
