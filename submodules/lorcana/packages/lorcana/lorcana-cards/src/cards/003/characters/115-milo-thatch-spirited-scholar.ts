import type { CharacterCard } from "@tcg/lorcana-types";
import { miloThatchSpiritedScholarI18n } from "./115-milo-thatch-spirited-scholar.i18n";

export const miloThatchSpiritedScholar: CharacterCard = {
  id: "tGe",
  canonicalId: "ci_tGe",
  reprints: ["set3-115"],
  cardType: "character",
  name: "Milo Thatch",
  version: "Spirited Scholar",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "003",
  cardNumber: 115,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c219f80dc2d34bea9b7a9bfdb4e04528",
    tcgPlayer: 536282,
  },
  text: [
    {
      title: "I'M YOUR MAN!",
      description: "While this character is at a location, he gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      condition: {
        type: "at-location",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1cr-1",
      name: "I'M YOUR MAN!",
      text: "I'M YOUR MAN! While this character is at a location, he gets +2 {S}.",
      type: "static",
    },
  ],
  i18n: miloThatchSpiritedScholarI18n,
};
