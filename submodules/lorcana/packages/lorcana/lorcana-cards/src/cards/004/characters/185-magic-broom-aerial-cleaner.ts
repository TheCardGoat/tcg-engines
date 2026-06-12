import type { CharacterCard } from "@tcg/lorcana-types";
import { magicBroomAerialCleanerI18n } from "./185-magic-broom-aerial-cleaner.i18n";

export const magicBroomAerialCleaner: CharacterCard = {
  id: "KvN",
  canonicalId: "ci_KvN",
  reprints: ["set4-185"],
  cardType: "character",
  name: "Magic Broom",
  version: "Aerial Cleaner",
  inkType: ["steel"],
  franchise: "Fantasia",
  set: "004",
  cardNumber: 185,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_df2a4ae009034326bac684df1aac9287",
    tcgPlayer: 547705,
  },
  text: [
    {
      title: "WINGED FOR A DAY",
      description:
        "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Dreamborn", "Broom"],
  abilities: [
    {
      condition: {
        type: "turn",
        whose: "your",
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1wc-1",
      name: "WINGED FOR A DAY",
      text: "WINGED FOR A DAY During your turn, this character gains Evasive.",
      type: "static",
    },
  ],
  i18n: magicBroomAerialCleanerI18n,
};
