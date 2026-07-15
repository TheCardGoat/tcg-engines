import type { CharacterCard } from "@tcg/lorcana-types";
import { herculesBelovedHeroI18n } from "./186-hercules-beloved-hero.i18n";

import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const herculesBelovedHero: CharacterCard = {
  id: "ZQh",
  canonicalId: "ci_ZfB",
  slug: "lorcana-ci_ZfB",
  printings: [
    {
      id: "set9-186",
      artId: "set9-186",
      setCode: "set9",
      collectorNumber: "186",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set4-180", "set9-186"],
  cardType: "character",
  name: "Hercules",
  version: "Beloved Hero",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "009",
  cardNumber: 186,
  rarity: "uncommon",
  cost: 6,
  strength: 6,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_37be647e4dfe481996bdf2bad1909176",
    tcgPlayer: "650119",
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "Resist +1",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    bodyguard,
    {
      id: "1wx-2",
      keyword: "Resist",
      text: "Resist +1",
      type: "keyword",
      value: 1,
    },
  ],
  i18n: herculesBelovedHeroI18n,
};
