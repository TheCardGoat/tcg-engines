import type { CharacterCard } from "@tcg/lorcana-types";
import { higginsUndercoverOfficerI18n } from "./005-higgins-undercover-officer.i18n";

export const higginsUndercoverOfficer: CharacterCard = {
  id: "6iI",
  canonicalId: "ci_6iI",
  reprints: ["set10-005"],
  cardType: "character",
  name: "Higgins",
  version: "Undercover Officer",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "010",
  cardNumber: 5,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_0511a324cc744453bb56c0d34d8f8d2a",
    tcgPlayer: 660275,
  },
  classifications: ["Dreamborn", "Ally", "Detective"],
  i18n: higginsUndercoverOfficerI18n,
};
