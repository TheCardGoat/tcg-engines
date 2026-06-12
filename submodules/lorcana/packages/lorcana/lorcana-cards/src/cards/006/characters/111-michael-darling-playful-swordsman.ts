import type { CharacterCard } from "@tcg/lorcana-types";
import { michaelDarlingPlayfulSwordsmanI18n } from "./111-michael-darling-playful-swordsman.i18n";

export const michaelDarlingPlayfulSwordsman: CharacterCard = {
  id: "SP2",
  canonicalId: "ci_SP2",
  reprints: ["set6-111"],
  cardType: "character",
  name: "Michael Darling",
  version: "Playful Swordsman",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "006",
  cardNumber: 111,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_2f6b3b92c227489ab785e1d828ea5f44",
    tcgPlayer: 593025,
  },
  classifications: ["Storyborn", "Ally", "Pirate"],
  i18n: michaelDarlingPlayfulSwordsmanI18n,
};
