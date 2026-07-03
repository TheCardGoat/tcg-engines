import type { CharacterCard } from "@tcg/lorcana-types";
import { meilinLeeLosingControlI18n } from "./016-meilin-lee-losing-control.i18n";

export const meilinLeeLosingControl: CharacterCard = {
  id: "m2j",
  canonicalId: "ci_m2j",
  slug: "lorcana-ci_m2j",
  printings: [
    {
      id: "set13-016",
      artId: "set13-016",
      setCode: "set13",
      collectorNumber: "16",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-016"],
  cardType: "character",
  name: "Meilin Lee",
  version: "Losing Control",
  inkType: ["amber"],
  franchise: "Turning Red",
  set: "013",
  cardNumber: 16,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_82ecd57e01d94bd18159ea10240ea41f",
  },
  text: [
    {
      title: "RED PANDA POWER",
      description:
        "When you play this character, look at the top 4 cards of your deck. You may reveal a Red Panda character card or a song card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Red Panda"],
  abilities: [
    {
      type: "triggered",
      name: "RED PANDA POWER",
      text: "RED PANDA POWER When you play this character, look at the top 4 cards of your deck. You may reveal a Red Panda character card or a song card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "scry",
        amount: 4,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            reveal: true,
            filter: {
              type: "or",
              filters: [
                {
                  type: "and",
                  filters: [
                    {
                      type: "card-type",
                      cardType: "character",
                    },
                    {
                      type: "has-classification",
                      classification: "Red Panda",
                    },
                  ],
                },
                {
                  type: "song",
                },
              ],
            },
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
    },
  ],
  i18n: meilinLeeLosingControlI18n,
};
