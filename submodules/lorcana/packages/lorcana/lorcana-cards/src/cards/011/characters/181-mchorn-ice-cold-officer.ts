import type { CharacterCard } from "@tcg/lorcana-types";
import { mchornIcecoldOfficerI18n } from "./181-mchorn-ice-cold-officer.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const mchornIcecoldOfficer: CharacterCard = {
  id: "8pd",
  canonicalId: "ci_8pd",
  reprints: ["set11-181"],
  cardType: "character",
  name: "McHorn",
  version: "Ice-Cold Officer",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "011",
  cardNumber: 181,
  rarity: "common",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a878e31ab9a94c4ba48079ebff6b155e",
    tcgPlayer: 673406,
  },
  text: "Bodyguard",
  classifications: ["Dreamborn", "Ally", "Detective"],
  abilities: [bodyguard],
  i18n: mchornIcecoldOfficerI18n,
};
