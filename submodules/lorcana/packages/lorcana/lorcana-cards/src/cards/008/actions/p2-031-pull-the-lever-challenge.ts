import type { ActionCard } from "@tcg/lorcana-types";
import { pullTheLeverP2ChallengeI18n } from "./p2-031-pull-the-lever-challenge.i18n";

export const pullTheLeverP2Challenge: ActionCard = {
  id: "fUf",
  canonicalId: "ci_UMU",
  slug: "lorcana-ci_UMU",
  printings: [
    {
      id: "set8-p2-031-challenge",
      artId: "ci_UMU-challenge",
      setCode: "set8",
      collectorNumber: "31",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set8-080"],
  cardType: "action",
  name: "Pull the Lever!",
  inkType: ["amethyst", "emerald"],
  franchise: "Emperors New Groove",
  set: "008",
  cardNumber: 31,
  rarity: "special",
  specialRarity: "challenge",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_6cc548274208402aa28a8b1da0c983aa",
    tcgPlayer: "631402",
  },
  text: "Choose one:\n- Draw 2 cards.\n- Each opponent chooses and discards a card.",
  abilities: [
    {
      type: "action",
      text: "Choose one:\n- Draw 2 cards.\n- Each opponent chooses and discards a card.",
      effect: {
        type: "choice",
        optionLabels: ["Draw 2 cards.", "Each opponent chooses and discards a card."],
        options: [
          {
            type: "draw",
            amount: 2,
            target: "CONTROLLER",
          },
          {
            type: "discard",
            amount: 1,
            chosen: true,
            from: "hand",
            target: "EACH_OPPONENT",
          },
        ],
      },
    },
  ],
  i18n: pullTheLeverP2ChallengeI18n,
};
