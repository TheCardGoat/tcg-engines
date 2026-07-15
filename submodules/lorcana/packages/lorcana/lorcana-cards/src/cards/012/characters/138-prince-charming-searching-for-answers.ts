import type { CharacterCard } from "@tcg/lorcana-types";
import { princeCharmingSearchingForAnswersI18n } from "./138-prince-charming-searching-for-answers.i18n";

export const princeCharmingSearchingForAnswers: CharacterCard = {
  id: "zqs",
  canonicalId: "ci_zqs",
  slug: "lorcana-ci_zqs",
  printings: [
    {
      id: "set12-138",
      artId: "set12-138",
      setCode: "set12",
      collectorNumber: "138",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-138"],
  cardType: "character",
  name: "Prince Charming",
  version: "Searching for Answers",
  inkType: ["sapphire"],
  franchise: "Cinderella",
  set: "012",
  cardNumber: 138,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 5,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_4129dadfa88448b5bda96c8b85320ffc",
    tcgPlayer: "692178",
  },
  classifications: ["Storyborn", "Hero", "Prince"],
  i18n: princeCharmingSearchingForAnswersI18n,
};
