import type { CharacterCard } from "@tcg/lorcana-types";
import { goonsMaleficentsUnderlingsI18n } from "./179-goons-maleficents-underlings.i18n";

export const goonsMaleficentsUnderlings: CharacterCard = {
  id: "SVn",
  canonicalId: "ci_SVn",
  slug: "lorcana-ci_SVn",
  printings: [
    {
      id: "set1-179",
      artId: "set1-179",
      setCode: "set1",
      collectorNumber: "179",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set1-179"],
  cardType: "character",
  name: "Goons",
  version: "Maleficent’s Underlings",
  inkType: ["steel"],
  franchise: "Sleeping Beauty",
  set: "001",
  cardNumber: 179,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_665baed36bfe4c0194ea9e3b22b19ac2",
    tcgPlayer: "508915",
  },
  classifications: ["Storyborn", "Ally"],
  i18n: goonsMaleficentsUnderlingsI18n,
};
