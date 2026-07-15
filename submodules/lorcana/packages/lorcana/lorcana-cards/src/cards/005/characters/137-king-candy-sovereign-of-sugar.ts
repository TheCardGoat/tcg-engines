import type { CharacterCard } from "@tcg/lorcana-types";
import { kingCandySovereignOfSugarI18n } from "./137-king-candy-sovereign-of-sugar.i18n";

export const kingCandySovereignOfSugar: CharacterCard = {
  id: "M35",
  canonicalId: "ci_M35",
  slug: "lorcana-ci_M35",
  printings: [
    {
      id: "set5-137",
      artId: "set5-137",
      setCode: "set5",
      collectorNumber: "137",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set5-137"],
  cardType: "character",
  name: "King Candy",
  version: "Sovereign of Sugar",
  inkType: ["sapphire"],
  franchise: "Wreck It Ralph",
  set: "005",
  cardNumber: 137,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_824fecbd011140ecaba3b8c8d7c4740a",
    tcgPlayer: "559789",
  },
  classifications: ["Storyborn", "Villain", "King", "Racer"],
  i18n: kingCandySovereignOfSugarI18n,
};
