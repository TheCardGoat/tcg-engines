import type { ActionCard } from "@tcg/lorcana-types";
import { strengthOfARagingFireP3ChallengeI18n } from "./p3-008-strength-of-a-raging-fire-challenge.i18n";

export const strengthOfARagingFireP3Challenge: ActionCard = {
  id: "Krz",
  canonicalId: "ci_s73",
  slug: "lorcana-ci_s73",
  printings: [
    {
      id: "set9-p3-008-challenge",
      artId: "ci_s73-challenge",
      setCode: "set9",
      collectorNumber: "8",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set2-201", "set9-201"],
  cardType: "action",
  name: "Strength of a Raging Fire",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "009",
  cardNumber: 8,
  rarity: "special",
  specialRarity: "challenge",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_0f4ad89d1f5348b0ae5b8d6010dc70d9",
    tcgPlayer: "647674",
  },
  text: "Deal damage to chosen character equal to the number of characters you have in play.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        amount: {
          controller: "you",
          type: "characters-in-play",
        },
        target: "CHOSEN_CHARACTER",
        type: "deal-damage",
      },
    },
  ],
  i18n: strengthOfARagingFireP3ChallengeI18n,
};
