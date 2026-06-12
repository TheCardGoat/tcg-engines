import type { CharacterCard } from "@tcg/lorcana-types";
import { fidgetRatigansHenchmanI18n } from "./108-fidget-ratigans-henchman.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const fidgetRatigansHenchman: CharacterCard = {
  id: "HKW",
  canonicalId: "ci_HKW",
  reprints: ["set2-108"],
  cardType: "character",
  name: "Fidget",
  version: "Ratigan's Henchman",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "002",
  cardNumber: 108,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0883cd88c2404f829929be8755b3d865",
    tcgPlayer: 527274,
  },
  text: "Evasive",
  classifications: ["Dreamborn", "Ally"],
  abilities: [evasive],
  i18n: fidgetRatigansHenchmanI18n,
};
