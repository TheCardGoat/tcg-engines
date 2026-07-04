import type { CharacterCard } from "@tcg/lorcana-types";
import { pegasusGiftForHerculesEpicI18n } from "./212-pegasus-gift-for-hercules-epic.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const pegasusGiftForHerculesEpic: CharacterCard = {
  id: "NhN",
  canonicalId: "ci_Sj7",
  slug: "lorcana-ci_Sj7",
  printings: [
    {
      id: "set9-212-epic",
      artId: "ci_Sj7-epic",
      setCode: "set9",
      collectorNumber: "212",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set4-084", "set9-084"],
  cardType: "character",
  name: "Pegasus",
  version: "Gift for Hercules",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "009",
  cardNumber: 212,
  rarity: "common",
  specialRarity: "epic",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6da933a64900487e99028f2a59b09754",
    tcgPlayer: "686340",
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive],
  i18n: pegasusGiftForHerculesEpicI18n,
};
