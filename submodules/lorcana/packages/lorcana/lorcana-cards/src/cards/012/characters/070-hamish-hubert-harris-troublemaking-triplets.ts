import type { CharacterCard } from "@tcg/lorcana-types";
import { hamishHubertHarrisTroublemakingTripletsI18n } from "./070-hamish-hubert-harris-troublemaking-triplets.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const hamishHubertHarrisTroublemakingTriplets: CharacterCard = {
  id: "4Qe",
  canonicalId: "ci_4Qe",
  reprints: ["set12-070"],
  cardType: "character",
  name: "Hamish, Hubert & Harris",
  version: "Troublemaking Triplets",
  inkType: ["emerald"],
  franchise: "Brave",
  set: "012",
  cardNumber: 70,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0035be6616d844e58e6b42d1d804ac0b",
  },
  text: "Evasive",
  classifications: ["Storyborn", "Ally", "Prince"],
  abilities: [evasive],
  i18n: hamishHubertHarrisTroublemakingTripletsI18n,
};
