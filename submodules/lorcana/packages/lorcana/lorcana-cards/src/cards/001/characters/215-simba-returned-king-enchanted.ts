import type { CharacterCard } from "@tcg/lorcana-types";
import { simbaReturnedKingEnchantedI18n } from "./215-simba-returned-king-enchanted.i18n";

import { challenger } from "../../../helpers/abilities/challenger";

export const simbaReturnedKingEnchanted: CharacterCard = {
  id: "FjY",
  canonicalId: "ci_11m",
  slug: "lorcana-ci_11m",
  printings: [
    {
      id: "set1-215-enchanted",
      artId: "ci_11m-enchanted",
      setCode: "set1",
      collectorNumber: "215",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set1-189"],
  cardType: "character",
  name: "Simba",
  version: "Returned King",
  inkType: ["steel"],
  franchise: "Lion King",
  set: "001",
  cardNumber: 215,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 7,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_80cf71e223cf491796609458b2866665",
    tcgPlayer: "510162",
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
  i18n: simbaReturnedKingEnchantedI18n,
};
