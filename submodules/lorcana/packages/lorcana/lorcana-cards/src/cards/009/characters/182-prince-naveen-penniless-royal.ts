import type { CharacterCard } from "@tcg/lorcana-types";
import { princeNaveenPennilessRoyalI18n } from "./182-prince-naveen-penniless-royal.i18n";

export const princeNaveenPennilessRoyal: CharacterCard = {
  id: "ZD1",
  canonicalId: "ci_DSe",
  slug: "lorcana-ci_DSe",
  printings: [
    {
      id: "set9-182",
      artId: "set9-182",
      setCode: "set9",
      collectorNumber: "182",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set2-191", "set9-182"],
  cardType: "character",
  name: "Prince Naveen",
  version: "Penniless Royal",
  inkType: ["steel"],
  franchise: "Princess and the Frog",
  set: "009",
  cardNumber: 182,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_6bfaedf8350c4f27ad9c60c2ecb2c942",
    tcgPlayer: "650115",
  },
  classifications: ["Storyborn", "Prince"],
  i18n: princeNaveenPennilessRoyalI18n,
};
