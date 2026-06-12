import type { CharacterCard } from "@tcg/lorcana-types";
import { kingOfHeartsPickyRulerI18n } from "./111-king-of-hearts-picky-ruler.i18n";

export const kingOfHeartsPickyRuler: CharacterCard = {
  id: "LEE",
  canonicalId: "ci_LEE",
  reprints: ["set7-111"],
  cardType: "character",
  name: "King of Hearts",
  version: "Picky Ruler",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "007",
  cardNumber: 111,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_f20054bb326b460c8ac1dc08f2723ce3",
    tcgPlayer: 618705,
  },
  text: [
    {
      title: "OBJECTIONABLE STATE",
      description: "Damaged characters can't challenge your characters.",
    },
  ],
  classifications: ["Storyborn", "Ally", "King"],
  abilities: [
    {
      effect: {
        restriction: "cant-be-challenged",
        target: "YOUR_CHARACTERS",
        challengerFilter: {
          type: "is-damaged",
        },
        type: "restriction",
      },
      id: "om1-1",
      name: "OBJECTIONABLE STATE",
      text: "OBJECTIONABLE STATE Damaged characters can't challenge your characters.",
      type: "static",
    },
  ],
  i18n: kingOfHeartsPickyRulerI18n,
};
