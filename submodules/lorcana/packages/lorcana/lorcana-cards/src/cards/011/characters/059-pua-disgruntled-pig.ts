import type { CharacterCard } from "@tcg/lorcana-types";
import { puaDisgruntledPigI18n } from "./059-pua-disgruntled-pig.i18n";

export const puaDisgruntledPig: CharacterCard = {
  id: "lA0",
  canonicalId: "ci_lA0",
  slug: "lorcana-ci_lA0",
  printings: [
    {
      id: "set11-059",
      artId: "set11-059",
      setCode: "set11",
      collectorNumber: "59",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set11-059"],
  cardType: "character",
  name: "Pua",
  version: "Disgruntled Pig",
  inkType: ["amethyst"],
  franchise: "Moana",
  set: "011",
  cardNumber: 59,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_e7d84a4948de49e49e717671d44fbb4c",
    tcgPlayer: "675297",
  },
  classifications: ["Storyborn", "Ally"],
  i18n: puaDisgruntledPigI18n,
};
