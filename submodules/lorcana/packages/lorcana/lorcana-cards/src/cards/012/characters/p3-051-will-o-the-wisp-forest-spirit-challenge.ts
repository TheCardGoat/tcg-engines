import type { CharacterCard } from "@tcg/lorcana-types";
import { willOTheWispForestSpiritP3ChallengeI18n } from "./p3-051-will-o-the-wisp-forest-spirit-challenge.i18n";
import { willOTheWispForestSpirit } from "./047-will-o-the-wisp-forest-spirit";

export const willOTheWispForestSpiritP3Challenge: CharacterCard = {
  ...willOTheWispForestSpirit,
  id: "Wxj",
  set: "P03",
  cardNumber: 51,
  rarity: "special",
  specialRarity: "challenge",
  i18n: willOTheWispForestSpiritP3ChallengeI18n,
};
