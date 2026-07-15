import type { CharacterCard } from "@tcg/lorcana-types";
import { kingLouieKingOfSwingI18n } from "./121-king-louie-king-of-swing.i18n";

import { singer } from "../../../helpers/abilities/singer";

export const kingLouieKingOfSwing: CharacterCard = {
  id: "9lN",
  canonicalId: "ci_9lN",
  slug: "lorcana-ci_9lN",
  printings: [
    {
      id: "set13-121",
      artId: "set13-121",
      setCode: "set13",
      collectorNumber: "121",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-121"],
  cardType: "character",
  name: "King Louie",
  version: "King of Swing",
  inkType: ["ruby"],
  franchise: "Jungle Book",
  set: "013",
  cardNumber: 121,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  text: "Singer 6",
  classifications: ["Storyborn", "King"],
  abilities: [singer(6)],
  i18n: kingLouieKingOfSwingI18n,
};
