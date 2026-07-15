import type { ActionCard } from "@tcg/lorcana-types";
import { findersKeepersP2ChallengeI18n } from "./p2-004-finders-keepers-challenge.i18n";

export const findersKeepersP2Challenge: ActionCard = {
  id: "beW",
  canonicalId: "ci_6e1",
  slug: "lorcana-ci_6e1",
  printings: [
    {
      id: "set5-p2-004-challenge",
      artId: "ci_6e1-challenge",
      setCode: "set5",
      collectorNumber: "4",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set5-060"],
  cardType: "action",
  name: "Finders Keepers",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "005",
  cardNumber: 4,
  rarity: "special",
  specialRarity: "challenge",
  cost: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_c2ea432892434d9c9814d4bf6c3791a5",
    tcgPlayer: "561997",
  },
  text: "Draw 3 cards.",
  abilities: [
    {
      id: "q4f-1",
      effect: {
        amount: 3,
        target: "CONTROLLER",
        type: "draw",
      },
      type: "action",
      text: "Draw 3 cards.",
    },
  ],
  i18n: findersKeepersP2ChallengeI18n,
};
