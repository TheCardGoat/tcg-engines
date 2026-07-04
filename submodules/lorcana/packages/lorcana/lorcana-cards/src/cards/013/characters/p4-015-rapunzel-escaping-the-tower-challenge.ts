import type { CharacterCard } from "@tcg/lorcana-types";
import { rapunzelEscapingTheTower } from "./095-rapunzel-escaping-the-tower";
import { rapunzelEscapingTheTowerP4ChallengeI18n } from "./p4-015-rapunzel-escaping-the-tower-challenge.i18n";

export const rapunzelEscapingTheTowerP4Challenge: CharacterCard = {
  ...rapunzelEscapingTheTower,
  id: "oH7",
  printings: [
    {
      id: "set13-p4-015-challenge",
      artId: "ci_zg8-challenge",
      setCode: "set13",
      collectorNumber: "15",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  cardNumber: 15,
  rarity: "special",
  specialRarity: "challenge",
  i18n: rapunzelEscapingTheTowerP4ChallengeI18n,
};
