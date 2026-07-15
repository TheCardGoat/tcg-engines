import type { CharacterCard } from "@tcg/lorcana-types";
import { lafayetteSleepyBassetHoundI18n } from "./132-lafayette-sleepy-basset-hound.i18n";

export const lafayetteSleepyBassetHound: CharacterCard = {
  id: "hVs",
  canonicalId: "ci_hVs",
  slug: "lorcana-ci_hVs",
  printings: [
    {
      id: "set8-132",
      artId: "set8-132",
      setCode: "set8",
      collectorNumber: "132",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set8-132"],
  cardType: "character",
  name: "Lafayette",
  version: "Sleepy Basset Hound",
  inkType: ["ruby"],
  franchise: "Aristocats",
  set: "008",
  cardNumber: 132,
  rarity: "common",
  cost: 5,
  strength: 7,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_5ac6e3218d074de683c518bcd4d9901c",
    tcgPlayer: "631437",
  },
  classifications: ["Storyborn"],
  i18n: lafayetteSleepyBassetHoundI18n,
};
