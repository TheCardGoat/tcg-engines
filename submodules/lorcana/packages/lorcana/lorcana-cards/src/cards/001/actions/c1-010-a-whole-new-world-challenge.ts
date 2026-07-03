import type { ActionCard } from "@tcg/lorcana-types";
import { aWholeNewWorldC1ChallengeI18n } from "./c1-010-a-whole-new-world-challenge.i18n";

export const aWholeNewWorldC1Challenge: ActionCard = {
  id: "9WQ",
  canonicalId: "ci_YDE",
  slug: "lorcana-ci_YDE",
  printings: [
    {
      id: "set1-c1-010-challenge",
      artId: "ci_YDE-challenge",
      setCode: "set1",
      collectorNumber: "10",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set1-195"],
  cardType: "action",
  name: "A Whole New World",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "001",
  cardNumber: 10,
  rarity: "special",
  specialRarity: "challenge",
  cost: 5,
  inkable: false,
  externalIds: {
    lorcast: "crd_94aea01bdb0a49a4aff52b8802388bb1",
  },
  text: "Each player discards their hand and draws 7 cards.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            amount: "all",
            from: "hand",
            target: "EACH_PLAYER",
            type: "discard",
          },
          {
            amount: 7,
            target: "EACH_PLAYER",
            type: "draw",
          },
        ],
      },
    },
  ],
  i18n: aWholeNewWorldC1ChallengeI18n,
};
