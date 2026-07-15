import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenRegalMonarchI18n } from "./007-the-queen-regal-monarch.i18n";

export const theQueenRegalMonarch: CharacterCard = {
  id: "5vj",
  canonicalId: "ci_RBq",
  slug: "lorcana-ci_RBq",
  printings: [
    {
      id: "set9-007",
      artId: "set9-007",
      setCode: "set9",
      collectorNumber: "7",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set2-027", "set9-007"],
  cardType: "character",
  name: "The Queen",
  version: "Regal Monarch",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "009",
  cardNumber: 7,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_94ecd20c33354dabb0cc32b7133133a9",
    tcgPlayer: "649956",
  },
  classifications: ["Storyborn", "Villain", "Queen"],
  i18n: theQueenRegalMonarchI18n,
};
