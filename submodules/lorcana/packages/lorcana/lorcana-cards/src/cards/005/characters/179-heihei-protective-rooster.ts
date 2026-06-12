import type { CharacterCard } from "@tcg/lorcana-types";
import { heiheiProtectiveRoosterI18n } from "./179-heihei-protective-rooster.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const heiheiProtectiveRooster: CharacterCard = {
  id: "xE6",
  canonicalId: "ci_xE6",
  reprints: ["set5-179"],
  cardType: "character",
  name: "HeiHei",
  version: "Protective Rooster",
  inkType: ["steel"],
  franchise: "Moana",
  set: "005",
  cardNumber: 179,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_3c5807144992461aa42226464a5cd693",
    tcgPlayer: 561158,
  },
  text: "Bodyguard",
  classifications: ["Dreamborn", "Ally"],
  abilities: [bodyguard],
  i18n: heiheiProtectiveRoosterI18n,
};
