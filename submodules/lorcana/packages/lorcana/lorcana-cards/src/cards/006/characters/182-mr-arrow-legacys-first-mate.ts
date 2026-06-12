import type { CharacterCard } from "@tcg/lorcana-types";
import { mrArrowLegacysFirstMateI18n } from "./182-mr-arrow-legacys-first-mate.i18n";
import { resist } from "../../../helpers/abilities/resist";

export const mrArrowLegacysFirstMate: CharacterCard = {
  id: "Sh0",
  canonicalId: "ci_Sh0",
  reprints: ["set6-182"],
  cardType: "character",
  name: "Mr. Arrow",
  version: "Legacy's First Mate",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  cardNumber: 182,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7bea7155c9164c43949d5e4031b5d810",
    tcgPlayer: 587970,
  },
  text: "Resist +1",
  classifications: ["Storyborn", "Ally", "Alien"],
  abilities: [resist(1)],
  i18n: mrArrowLegacysFirstMateI18n,
};
