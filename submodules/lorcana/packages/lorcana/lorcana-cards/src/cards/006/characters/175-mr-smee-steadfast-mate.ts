import type { CharacterCard } from "@tcg/lorcana-types";
import { mrSmeeSteadfastMateI18n } from "./175-mr-smee-steadfast-mate.i18n";

export const mrSmeeSteadfastMate: CharacterCard = {
  id: "iTQ",
  canonicalId: "ci_iTQ",
  reprints: ["set6-175"],
  cardType: "character",
  name: "Mr. Smee",
  version: "Steadfast Mate",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "006",
  cardNumber: 175,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7ee0b368f69e45f7832d164a926951ff",
    tcgPlayer: 583849,
  },
  text: [
    {
      title: "GOOD CATCH",
      description:
        "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Ally", "Pirate"],
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
      id: "8zn-1",
      name: "GOOD CATCH",
      text: "GOOD CATCH During your turn, this character gains Evasive.",
      type: "static",
    },
  ],
  i18n: mrSmeeSteadfastMateI18n,
};
