import type { CharacterCard } from "@tcg/lorcana-types";
import { youngMacintoshProudSonI18n } from "./180-young-macintosh-proud-son.i18n";

export const youngMacintoshProudSon: CharacterCard = {
  id: "ABk",
  canonicalId: "ci_ABk",
  slug: "lorcana-ci_ABk",
  printings: [
    {
      id: "set12-180",
      artId: "set12-180",
      setCode: "set12",
      collectorNumber: "180",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-180"],
  cardType: "character",
  name: "Young Macintosh",
  version: "Proud Son",
  inkType: ["steel"],
  franchise: "Brave",
  set: "012",
  cardNumber: 180,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_35c7f5fe2959472a8f4abc38de41a8af",
    tcgPlayer: "692078",
  },
  classifications: ["Storyborn", "Ally"],
  i18n: youngMacintoshProudSonI18n,
};
