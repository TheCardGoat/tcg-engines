import type { CharacterCard } from "@tcg/lorcana-types";
import { aladdinResoluteSwordsmanI18n } from "./172-aladdin-resolute-swordsman.i18n";

export const aladdinResoluteSwordsman: CharacterCard = {
  id: "LOo",
  canonicalId: "ci_LOo",
  slug: "lorcana-ci_LOo",
  printings: [
    {
      id: "set4-172",
      artId: "set4-172",
      setCode: "set4",
      collectorNumber: "172",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set4-172"],
  cardType: "character",
  name: "Aladdin",
  version: "Resolute Swordsman",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "004",
  cardNumber: 172,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_7f533fd75db94b9da5770ff4daa062ce",
    tcgPlayer: "550617",
  },
  classifications: ["Storyborn", "Hero"],
  i18n: aladdinResoluteSwordsmanI18n,
};
