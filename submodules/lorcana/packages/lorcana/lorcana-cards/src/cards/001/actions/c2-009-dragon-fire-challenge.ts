import type { ActionCard } from "@tcg/lorcana-types";
import { dragonFireC2ChallengeI18n } from "./c2-009-dragon-fire-challenge.i18n";

export const dragonFireC2Challenge: ActionCard = {
  id: "Yxc",
  canonicalId: "ci_fJr",
  slug: "lorcana-ci_fJr",
  printings: [
    {
      id: "set1-c2-009-challenge",
      artId: "ci_fJr-challenge",
      setCode: "set1",
      collectorNumber: "9",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set1-130", "set10-133"],
  cardType: "action",
  name: "Dragon Fire",
  inkType: ["ruby"],
  franchise: "Sleeping Beauty",
  set: "001",
  cardNumber: 9,
  rarity: "special",
  specialRarity: "challenge",
  cost: 5,
  inkable: false,
  externalIds: {
    lorcast: "crd_f54b0e3b38d340ffa793953c49e6cb56",
  },
  text: "Banish chosen character.",
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
      type: "action",
    },
  ],
  i18n: dragonFireC2ChallengeI18n,
};
