import type { CharacterCard } from "@tcg/lorcana-types";
import { pegasusGiftForHerculesI18n } from "./084-pegasus-gift-for-hercules.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const pegasusGiftForHercules: CharacterCard = {
  id: "PD1",
  canonicalId: "ci_Sj7",
  reprints: ["set4-084", "set9-084"],
  cardType: "character",
  name: "Pegasus",
  version: "Gift for Hercules",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 84,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5623b1aaf330477aa9d14cd755597509",
    tcgPlayer: 650149,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive],
  i18n: pegasusGiftForHerculesI18n,
};
