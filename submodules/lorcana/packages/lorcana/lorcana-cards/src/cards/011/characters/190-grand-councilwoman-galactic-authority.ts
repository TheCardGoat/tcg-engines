import type { CharacterCard } from "@tcg/lorcana-types";
import { grandCouncilwomanGalacticAuthorityI18n } from "./190-grand-councilwoman-galactic-authority.i18n";

export const grandCouncilwomanGalacticAuthority: CharacterCard = {
  id: "x6z",
  canonicalId: "ci_x6z",
  slug: "lorcana-ci_x6z",
  printings: [
    {
      id: "set11-190",
      artId: "set11-190",
      setCode: "set11",
      collectorNumber: "190",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set11-190"],
  cardType: "character",
  name: "Grand Councilwoman",
  version: "Galactic Authority",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 190,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 5,
  lore: 3,
  inkable: false,
  vanilla: true,
  externalIds: {
    lorcast: "crd_a0d09a062bc54cceb56ecef2636860c3",
    tcgPlayer: "676244",
  },
  classifications: ["Dreamborn", "Alien"],
  i18n: grandCouncilwomanGalacticAuthorityI18n,
};
