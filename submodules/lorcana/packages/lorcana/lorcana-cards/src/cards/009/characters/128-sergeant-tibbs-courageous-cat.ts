import type { CharacterCard } from "@tcg/lorcana-types";
import { sergeantTibbsCourageousCatI18n } from "./128-sergeant-tibbs-courageous-cat.i18n";

export const sergeantTibbsCourageousCat: CharacterCard = {
  id: "A4G",
  canonicalId: "ci_VLR",
  slug: "lorcana-ci_VLR",
  printings: [
    {
      id: "set9-128",
      artId: "set9-128",
      setCode: "set9",
      collectorNumber: "128",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set1-124", "set9-128"],
  cardType: "character",
  name: "Sergeant Tibbs",
  version: "Courageous Cat",
  inkType: ["ruby"],
  franchise: "101 Dalmatians",
  set: "009",
  cardNumber: 128,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_d86fe241e2434bc49ee61f5516366f08",
    tcgPlayer: "650063",
  },
  classifications: ["Storyborn", "Ally"],
  i18n: sergeantTibbsCourageousCatI18n,
};
