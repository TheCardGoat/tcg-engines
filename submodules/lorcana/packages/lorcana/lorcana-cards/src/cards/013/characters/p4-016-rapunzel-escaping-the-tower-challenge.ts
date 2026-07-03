import type { CharacterCard } from "@tcg/lorcana-types";
import { rapunzelEscapingTheTower } from "./095-rapunzel-escaping-the-tower";
import { rapunzelEscapingTheTowerP4ChallengeI18n } from "./p4-016-rapunzel-escaping-the-tower-challenge.i18n";

export const rapunzelEscapingTheTowerP4Challenge: CharacterCard = {
  ...rapunzelEscapingTheTower,
  id: "nor",
  printings: [
    {
      id: "set13-p4-016-challenge",
      artId: "ci_zg8-challenge",
      setCode: "set13",
      collectorNumber: "16",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  cardNumber: 16,
  rarity: "special",
  specialRarity: "challenge",
  i18n: rapunzelEscapingTheTowerP4ChallengeI18n,
};
