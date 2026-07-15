import type { CharacterCard } from "@tcg/lorcana-types";
import { magicalMaidFeatherDusterI18n } from "./050-magical-maid-feather-duster.i18n";

export const magicalMaidFeatherDuster: CharacterCard = {
  id: "S5i",
  canonicalId: "ci_S5i",
  slug: "lorcana-ci_S5i",
  printings: [
    {
      id: "set4-050",
      artId: "set4-050",
      setCode: "set4",
      collectorNumber: "50",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set4-050"],
  cardType: "character",
  name: "Magical Maid",
  version: "Feather Duster",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "004",
  cardNumber: 50,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_217effcb1f034d1ca6e36929cce6f11d",
    tcgPlayer: "550568",
  },
  classifications: ["Storyborn", "Ally"],
  i18n: magicalMaidFeatherDusterI18n,
};
