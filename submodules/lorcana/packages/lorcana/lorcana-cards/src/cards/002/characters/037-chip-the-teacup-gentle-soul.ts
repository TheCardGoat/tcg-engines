import type { CharacterCard } from "@tcg/lorcana-types";
import { chipTheTeacupGentleSoulI18n } from "./037-chip-the-teacup-gentle-soul.i18n";

export const chipTheTeacupGentleSoul: CharacterCard = {
  id: "8TZ",
  canonicalId: "ci_8TZ",
  reprints: ["set2-037"],
  cardType: "character",
  name: "Chip the Teacup",
  version: "Gentle Soul",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "002",
  cardNumber: 37,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_a385d4bd2e5543609f40f170f17a6a55",
    tcgPlayer: 525108,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: chipTheTeacupGentleSoulI18n,
};
