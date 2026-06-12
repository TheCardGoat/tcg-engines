import type { CharacterCard } from "@tcg/lorcana-types";
import { happyLivelyKnightI18n } from "./191-happy-lively-knight.i18n";

export const happyLivelyKnight: CharacterCard = {
  id: "qmH",
  canonicalId: "ci_qmH",
  reprints: ["set5-191"],
  cardType: "character",
  name: "Happy",
  version: "Lively Knight",
  inkType: ["steel"],
  franchise: "Snow White",
  set: "005",
  cardNumber: 191,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_fa38166d51fb479a962761c3c17a670d",
    tcgPlayer: 559665,
  },
  text: [
    {
      title: "BURST OF SPEED",
      description:
        "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
  abilities: [
    {
      condition: {
        type: "turn",
        whose: "your",
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "g6u-1",
      name: "BURST OF SPEED",
      text: "BURST OF SPEED During your turn, this character gains Evasive.",
      type: "static",
    },
  ],
  i18n: happyLivelyKnightI18n,
};
