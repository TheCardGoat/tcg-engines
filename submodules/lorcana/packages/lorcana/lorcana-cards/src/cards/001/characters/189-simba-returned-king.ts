import type { CharacterCard } from "@tcg/lorcana-types";
import { simbaReturnedKingI18n } from "./189-simba-returned-king.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const simbaReturnedKing: CharacterCard = {
  id: "mW3",
  canonicalId: "ci_11m",
  reprints: ["set1-189"],
  cardType: "character",
  name: "Simba",
  version: "Returned King",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "001",
  cardNumber: 189,
  rarity: "rare",
  cost: 7,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_80cf71e223cf491796609458b2866665",
    tcgPlayer: 510162,
  },
  text: [
    {
      title: "Challenger +4",
    },
    {
      title: "POUNCE",
      description:
        "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Hero", "King"],
  abilities: [
    challenger(4),
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
      id: "nj8-2",
      name: "POUNCE",
      text: "POUNCE During your turn, this character gains Evasive.",
      type: "static",
    },
  ],
  i18n: simbaReturnedKingI18n,
};
