import type { CharacterCard } from "@tcg/lorcana-types";
import { robinHoodDaydreamerI18n } from "./084-robin-hood-daydreamer.i18n";

export const robinHoodDaydreamer: CharacterCard = {
  id: "tod",
  canonicalId: "ci_kTq",
  slug: "lorcana-ci_kTq",
  printings: [
    {
      id: "set3-084",
      artId: "set3-084",
      setCode: "set3",
      collectorNumber: "84",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set3-084", "set9-070"],
  cardType: "character",
  name: "Robin Hood",
  version: "Daydreamer",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "003",
  cardNumber: 84,
  rarity: "rare",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 4,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_93d3181a0964484f8c491f7b96dd7d02",
    tcgPlayer: "650012",
  },
  classifications: ["Dreamborn", "Hero"],
  i18n: robinHoodDaydreamerI18n,
};
