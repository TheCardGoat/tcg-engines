import type { CharacterCard } from "@tcg/lorcana-types";
import { helgaSinclairToughAsNailsI18n } from "./183-helga-sinclair-tough-as-nails.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const helgaSinclairToughAsNails: CharacterCard = {
  id: "lpp",
  canonicalId: "ci_lpp",
  reprints: ["set7-183"],
  cardType: "character",
  name: "Helga Sinclair",
  version: "Tough as Nails",
  inkType: ["steel"],
  franchise: "Atlantis",
  set: "007",
  cardNumber: 183,
  rarity: "uncommon",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_ba65ec4007544e7ba265690e8e823312",
    tcgPlayer: 619511,
  },
  text: [
    {
      title: "Challenger +3 (While challenging, this character gets +3 {S}).",
    },
    {
      title: "QUICK REFLEXES",
      description:
        "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    challenger(3),
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
      id: "1ld-2",
      name: "QUICK REFLEXES",
      text: "QUICK REFLEXES During your turn, this character gains Evasive.",
      type: "static",
    },
  ],
  i18n: helgaSinclairToughAsNailsI18n,
};
