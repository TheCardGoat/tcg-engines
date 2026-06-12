import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchHighBadnessLevelI18n } from "./185-stitch-high-badness-level.i18n";

export const stitchHighBadnessLevel: CharacterCard = {
  id: "xeg",
  canonicalId: "ci_xeg",
  reprints: ["set11-185"],
  cardType: "character",
  name: "Stitch",
  version: "High Badness Level",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 185,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7e2cac54dd5d4e0ea2db87cf752df00a",
    tcgPlayer: 673335,
  },
  text: [
    {
      title: "AMPED UP",
      description:
        "While you have a character named Lilo in play, this character gains Challenger +3. (They get +3 {S} while challenging.)",
    },
  ],
  classifications: ["Storyborn", "Hero", "Alien"],
  abilities: [
    {
      id: "qzq-1",
      condition: {
        type: "has-named-character",
        name: "Lilo",
        controller: "you",
      },
      effect: {
        keyword: "Challenger",
        target: "SELF",
        type: "gain-keyword",
        value: 3,
      },
      name: "AMPED UP",
      type: "static",
      text: "AMPED UP While you have a character named Lilo in play, this character gains Challenger +3.",
    },
  ],
  i18n: stitchHighBadnessLevelI18n,
};
