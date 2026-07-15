import type { CharacterCard } from "@tcg/lorcana-types";
import { princeEricNobleSwordsmanI18n } from "./008-prince-eric-noble-swordsman.i18n";

export const princeEricNobleSwordsman: CharacterCard = {
  id: "f2i",
  canonicalId: "ci_f2i",
  slug: "lorcana-ci_f2i",
  printings: [
    {
      id: "set12-008",
      artId: "set12-008",
      setCode: "set12",
      collectorNumber: "8",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-008"],
  cardType: "character",
  name: "Prince Eric",
  version: "Noble Swordsman",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "012",
  cardNumber: 8,
  rarity: "common",
  cost: 5,
  strength: 6,
  willpower: 7,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_fec8fc6f1b9745078b63c897c32c95c5",
    tcgPlayer: "692009",
  },
  classifications: ["Dreamborn", "Hero", "Prince"],
  i18n: princeEricNobleSwordsmanI18n,
};
