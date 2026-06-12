import type { ActionCard } from "@tcg/lorcana-types";
import { glimmerVsGlimmerI18n } from "./130-glimmer-vs-glimmer.i18n";

export const glimmerVsGlimmer: ActionCard = {
  id: "xCq",
  canonicalId: "ci_xCq",
  reprints: ["set5-130"],
  cardType: "action",
  name: "Glimmer vs Glimmer",
  inkType: ["ruby"],
  franchise: "Lorcana",
  set: "005",
  cardNumber: 130,
  rarity: "uncommon",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_00e4569178e847649514f979474839fe",
    tcgPlayer: 560548,
  },
  text: "Banish chosen character of yours to banish chosen character.",
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "you",
              selector: "chosen",
              zones: ["play"],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "if-you-do",
            },
            then: {
              type: "banish",
              target: {
                cardTypes: ["character"],
                count: 1,
                owner: "any",
                selector: "chosen",
                zones: ["play"],
                requireDifferentTargets: true,
              },
            },
          },
        ],
      },
      id: "e3r-1",
      text: "Banish chosen character of yours to banish chosen character.",
      type: "action",
    },
  ],
  i18n: glimmerVsGlimmerI18n,
};
