import type { CharacterCard } from "@tcg/lorcana-types";
import { denahiImpatientHunterI18n } from "./124-denahi-impatient-hunter.i18n";

import { reckless } from "../../../helpers/abilities/reckless";
import { resist } from "../../../helpers/abilities/resist";

export const denahiImpatientHunter: CharacterCard = {
  id: "OYJ",
  canonicalId: "ci_OYJ",
  slug: "lorcana-ci_OYJ",
  printings: [
    {
      id: "set7-124",
      artId: "set7-124",
      setCode: "set7",
      collectorNumber: "124",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set7-124"],
  cardType: "character",
  name: "Denahi",
  version: "Impatient Hunter",
  inkType: ["ruby", "steel"],
  franchise: "Brother Bear",
  set: "007",
  cardNumber: 124,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_b91e58cc0277450595a28974cf70c180",
    tcgPlayer: "618144",
  },
  text: [
    {
      title: "Reckless",
    },
    {
      title: "Resist +2",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [reckless, resist(2)],
  i18n: denahiImpatientHunterI18n,
};
