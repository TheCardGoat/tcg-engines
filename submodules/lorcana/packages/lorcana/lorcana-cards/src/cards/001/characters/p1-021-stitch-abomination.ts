import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchAbominationP1I18n } from "./p1-021-stitch-abomination.i18n";

export const stitchAbominationP1: CharacterCard = {
  id: "zIV",
  canonicalId: "ci_hJx",
  slug: "lorcana-ci_hJx",
  printings: [
    {
      id: "set1-p1-021",
      artId: "set1-p1-021",
      setCode: "set1",
      collectorNumber: "21",
      rarity: "special",
      imageUrl: "",
    },
  ],
  reprints: ["set1-p1-021", "set1-125"],
  cardType: "character",
  name: "Stitch",
  version: "Abomination",
  inkType: ["ruby"],
  franchise: "Lilo and Stitch",
  set: "001",
  cardNumber: 21,
  rarity: "special",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 3,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_19a7e851b7724bd58b285b76eb387c5a",
    tcgPlayer: "508790",
  },
  classifications: ["Storyborn", "Hero", "Alien"],
  i18n: stitchAbominationP1I18n,
};
