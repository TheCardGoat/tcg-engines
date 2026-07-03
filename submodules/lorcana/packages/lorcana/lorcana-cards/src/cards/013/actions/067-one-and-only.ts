import type { ActionCard } from "@tcg/lorcana-types";
import { oneAndOnlyI18n } from "./067-one-and-only.i18n";

export const oneAndOnly: ActionCard = {
  id: "AFL",
  canonicalId: "ci_AFL",
  slug: "lorcana-ci_AFL",
  printings: [
    {
      id: "set13-067",
      artId: "set13-067",
      setCode: "set13",
      collectorNumber: "67",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-067"],
  cardType: "action",
  name: "One and Only",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "013",
  cardNumber: 67,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_69429f224b234571a1257b20258d97a4",
  },
  text: "Choose a character. Banish all other characters with the same name as that character.",
  abilities: [
    {
      type: "action",
      text: "Choose a character. Banish all other characters with the same name as that character.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "select-target",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "banish",
            target: {
              selector: "all",
              count: "all",
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
              filter: {
                sameNameAsChosenCard: true,
                excludeChosenCard: true,
              },
            },
          },
        ],
      },
    },
  ],
  i18n: oneAndOnlyI18n,
};
