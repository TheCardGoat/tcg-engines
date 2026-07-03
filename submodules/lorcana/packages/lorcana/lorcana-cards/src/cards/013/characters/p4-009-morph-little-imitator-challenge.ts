import type { CharacterCard } from "@tcg/lorcana-types";
import { morphLittleImitator } from "./057-morph-little-imitator";
import { morphLittleImitatorP4ChallengeI18n } from "./p4-009-morph-little-imitator-challenge.i18n";

export const morphLittleImitatorP4Challenge: CharacterCard = {
  ...morphLittleImitator,
  id: "q7p",
  printings: [
    {
      id: "set13-p4-009-challenge",
      artId: "ci_yd8-challenge",
      setCode: "set13",
      collectorNumber: "9",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  cardNumber: 9,
  rarity: "special",
  specialRarity: "challenge",
  i18n: morphLittleImitatorP4ChallengeI18n,
};
