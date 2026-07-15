import type { ActionCard } from "@tcg/lorcana-types";
import { dragonFireC1ChallengeI18n } from "./c1-001-dragon-fire-challenge.i18n";

export const dragonFireC1Challenge: ActionCard = {
  id: "xXC",
  canonicalId: "ci_fJr",
  slug: "lorcana-ci_fJr",
  printings: [
    {
      id: "set1-c1-001-challenge",
      artId: "ci_fJr-challenge",
      setCode: "set1",
      collectorNumber: "1",
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
  cardNumber: 1,
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
  i18n: dragonFireC1ChallengeI18n,
};
