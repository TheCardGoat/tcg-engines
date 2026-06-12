import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckDeepseaDiverI18n } from "./178-donald-duck-deep-sea-diver.i18n";

export const donaldDuckDeepseaDiver: CharacterCard = {
  id: "iVk",
  canonicalId: "ci_iVk",
  reprints: ["set2-178"],
  cardType: "character",
  name: "Donald Duck",
  version: "Deep-Sea Diver",
  inkType: ["steel"],
  set: "002",
  cardNumber: 178,
  rarity: "common",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_0e5d59110fee4c7e922e2ec67f5fe1a6",
    tcgPlayer: 524218,
  },
  classifications: ["Dreamborn", "Hero"],
  i18n: donaldDuckDeepseaDiverI18n,
};
