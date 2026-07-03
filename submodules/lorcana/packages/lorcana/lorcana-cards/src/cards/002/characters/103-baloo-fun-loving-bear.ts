import type { CharacterCard } from "@tcg/lorcana-types";
import { balooFunlovingBearI18n } from "./103-baloo-fun-loving-bear.i18n";

export const balooFunlovingBear: CharacterCard = {
  id: "U0W",
  canonicalId: "ci_U0W",
  slug: "lorcana-ci_U0W",
  printings: [
    {
      id: "set2-103",
      artId: "set2-103",
      setCode: "set2",
      collectorNumber: "103",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set2-103"],
  cardType: "character",
  name: "Baloo",
  version: "Fun-Loving Bear",
  inkType: ["ruby"],
  franchise: "Jungle Book",
  set: "002",
  cardNumber: 103,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_8f2b1625f47a4b4ea1d5f90b61985827",
    tcgPlayer: "527752",
  },
  classifications: ["Storyborn", "Ally"],
  i18n: balooFunlovingBearI18n,
};
