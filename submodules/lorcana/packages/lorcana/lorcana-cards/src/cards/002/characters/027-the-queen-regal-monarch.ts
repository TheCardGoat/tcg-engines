import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenRegalMonarchI18n } from "./027-the-queen-regal-monarch.i18n";

export const theQueenRegalMonarch: CharacterCard = {
  id: "h77",
  canonicalId: "ci_RBq",
  slug: "lorcana-ci_RBq",
  printings: [
    {
      id: "set2-027",
      artId: "set2-027",
      setCode: "set2",
      collectorNumber: "27",
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
  set: "002",
  cardNumber: 27,
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
