import type { CharacterCard } from "@tcg/lorcana-types";
import { captainHookForcefulDuelistI18n } from "./174-captain-hook-forceful-duelist.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const captainHookForcefulDuelist: CharacterCard = {
  id: "p7d",
  canonicalId: "ci_ZXl",
  reprints: ["set1-174", "set8-186"],
  cardType: "character",
  name: "Captain Hook",
  version: "Forceful Duelist",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "001",
  cardNumber: 174,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_269551f76e10446cbf947278bf155889",
    tcgPlayer: 631706,
  },
  text: "Challenger +2",
  classifications: ["Dreamborn", "Villain", "Pirate", "Captain"],
  abilities: [challenger(2)],
  i18n: captainHookForcefulDuelistI18n,
};
