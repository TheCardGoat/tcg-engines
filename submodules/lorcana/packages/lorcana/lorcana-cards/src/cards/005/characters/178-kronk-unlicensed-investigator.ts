import type { CharacterCard } from "@tcg/lorcana-types";
import { kronkUnlicensedInvestigatorI18n } from "./178-kronk-unlicensed-investigator.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const kronkUnlicensedInvestigator: CharacterCard = {
  id: "D2Y",
  canonicalId: "ci_D2Y",
  reprints: ["set5-178"],
  cardType: "character",
  name: "Kronk",
  version: "Unlicensed Investigator",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "005",
  cardNumber: 178,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_bb7c0120d4b14622b11e2a06f9352a3c",
    tcgPlayer: 561492,
  },
  text: "Challenger +1",
  classifications: ["Dreamborn", "Ally"],
  abilities: [challenger(1)],
  i18n: kronkUnlicensedInvestigatorI18n,
};
