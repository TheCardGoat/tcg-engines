import type { CharacterCard } from "@tcg/lorcana-types";
import { woodyJungleGuideP3ChallengeI18n } from "./p3-053-woody-jungle-guide-challenge.i18n";
import { woodyJungleGuide } from "./015-woody-jungle-guide";

export const woodyJungleGuideP3Challenge: CharacterCard = {
  ...woodyJungleGuide,
  id: "N4A",
  set: "P03",
  cardNumber: 53,
  rarity: "special",
  specialRarity: "challenge",
  i18n: woodyJungleGuideP3ChallengeI18n,
};
