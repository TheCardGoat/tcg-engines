import type { ActionCard } from "@tcg/lorcana-types";
import { ifIDidntHaveYouP4ChallengeI18n } from "./p4-014-if-i-didnt-have-you-challenge.i18n";

export const ifIDidntHaveYouP4Challenge: ActionCard = {
  id: "O5K",
  canonicalId: "ci_3Jh",
  slug: "lorcana-ci_3Jh",
  printings: [
    {
      id: "set13-p4-014-challenge",
      artId: "ci_3Jh-challenge",
      setCode: "set13",
      collectorNumber: "14",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set13-032"],
  cardType: "action",
  name: "If I Didn't Have You",
  inkType: ["amber"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 14,
  rarity: "special",
  specialRarity: "challenge",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_93ddde65a0ac4c4aa83ef2418e5472ae",
    tcgPlayer: "704560",
  },
  text: "You and another chosen player each draw 2 cards.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "You and another chosen player each draw 2 cards.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 2,
            target: "CONTROLLER",
          },
          {
            type: "draw",
            amount: 2,
            target: "OPPONENT",
          },
        ],
      },
    },
  ],
  i18n: ifIDidntHaveYouP4ChallengeI18n,
};
