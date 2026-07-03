import type { CharacterCard } from "@tcg/lorcana-types";
import { herculesHeroInTrainingI18n } from "./182-hercules-hero-in-training.i18n";

export const herculesHeroInTraining: CharacterCard = {
  id: "GRk",
  canonicalId: "ci_GRk",
  slug: "lorcana-ci_GRk",
  printings: [
    {
      id: "set2-182",
      artId: "set2-182",
      setCode: "set2",
      collectorNumber: "182",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set2-182"],
  cardType: "character",
  name: "Hercules",
  version: "Hero in Training",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "002",
  cardNumber: 182,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_9d7dbe554e37401d8507e1b3b69c69bd",
    tcgPlayer: "527774",
  },
  classifications: ["Storyborn", "Hero", "Prince"],
  i18n: herculesHeroInTrainingI18n,
};
