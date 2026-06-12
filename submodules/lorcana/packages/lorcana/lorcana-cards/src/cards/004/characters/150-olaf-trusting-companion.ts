import type { CharacterCard } from "@tcg/lorcana-types";
import { olafTrustingCompanionI18n } from "./150-olaf-trusting-companion.i18n";
import { support } from "../../../helpers/abilities/support";

export const olafTrustingCompanion: CharacterCard = {
  id: "QcK",
  canonicalId: "ci_QcK",
  reprints: ["set4-150"],
  cardType: "character",
  name: "Olaf",
  version: "Trusting Companion",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "004",
  cardNumber: 150,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d7ce71c1b8814223bb8f1d9ed75cdfb6",
    tcgPlayer: 550609,
  },
  text: "Support",
  classifications: ["Storyborn", "Ally"],
  abilities: [support],
  i18n: olafTrustingCompanionI18n,
};
