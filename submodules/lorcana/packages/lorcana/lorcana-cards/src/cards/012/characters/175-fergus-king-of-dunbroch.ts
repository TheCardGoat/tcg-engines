import type { CharacterCard } from "@tcg/lorcana-types";
import { fergusKingOfDunbrochI18n } from "./175-fergus-king-of-dunbroch.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const fergusKingOfDunbroch: CharacterCard = {
  id: "Yws",
  canonicalId: "ci_Yws",
  reprints: ["set12-175"],
  cardType: "character",
  name: "Fergus",
  version: "King of DunBroch",
  inkType: ["steel"],
  franchise: "Brave",
  set: "012",
  cardNumber: 175,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  text: "<Bodyguard>",
  abilities: [bodyguard],
  classifications: ["Storyborn", "Mentor", "King"],
  i18n: fergusKingOfDunbrochI18n,
};
