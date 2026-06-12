import type { CharacterCard } from "@tcg/lorcana-types";
import { pigletEntrancedBySnowI18n } from "./139-piglet-entranced-by-snow.i18n";

export const pigletEntrancedBySnow: CharacterCard = {
  id: "N08",
  canonicalId: "ci_N08",
  reprints: ["set11-139"],
  cardType: "character",
  name: "Piglet",
  version: "Entranced by Snow",
  inkType: ["sapphire"],
  franchise: "Winnie the Pooh",
  set: "011",
  cardNumber: 139,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_39ccc87a07884c2789a33b03738f2bb3",
    tcgPlayer: 676219,
  },
  classifications: ["Storyborn", "Ally"],
  i18n: pigletEntrancedBySnowI18n,
};
