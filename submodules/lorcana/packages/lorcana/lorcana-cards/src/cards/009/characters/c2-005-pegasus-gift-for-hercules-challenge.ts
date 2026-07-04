import type { CharacterCard } from "@tcg/lorcana-types";
import { pegasusGiftForHerculesC2ChallengeI18n } from "./c2-005-pegasus-gift-for-hercules-challenge.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const pegasusGiftForHerculesC2Challenge: CharacterCard = {
  id: "uKF",
  canonicalId: "ci_Sj7",
  slug: "lorcana-ci_Sj7",
  printings: [
    {
      id: "set9-c2-005-challenge",
      artId: "ci_Sj7-challenge",
      setCode: "set9",
      collectorNumber: "5",
      rarity: "challenge",
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
  cardNumber: 5,
  rarity: "special",
  specialRarity: "challenge",
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
  i18n: pegasusGiftForHerculesC2ChallengeI18n,
};
