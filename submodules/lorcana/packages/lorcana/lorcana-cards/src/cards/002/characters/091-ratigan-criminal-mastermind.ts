import type { CharacterCard } from "@tcg/lorcana-types";
import { ratiganCriminalMastermindI18n } from "./091-ratigan-criminal-mastermind.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const ratiganCriminalMastermind: CharacterCard = {
  id: "yTi",
  canonicalId: "ci_yTi",
  reprints: ["set2-091"],
  cardType: "character",
  name: "Ratigan",
  version: "Criminal Mastermind",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "002",
  cardNumber: 91,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 1,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_9dcde646049c4c889034da24e175f7f8",
    tcgPlayer: 527750,
  },
  text: "Evasive",
  classifications: ["Dreamborn", "Villain"],
  abilities: [evasive],
  i18n: ratiganCriminalMastermindI18n,
};
