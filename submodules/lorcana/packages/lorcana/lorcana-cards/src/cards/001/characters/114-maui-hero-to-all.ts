import type { CharacterCard } from "@tcg/lorcana-types";
import { mauiHeroToAllI18n } from "./114-maui-hero-to-all.i18n";
import { reckless } from "../../../helpers/abilities/reckless";
import { rush } from "../../../helpers/abilities/rush";

export const mauiHeroToAll: CharacterCard = {
  id: "bes",
  canonicalId: "ci_g8i",
  reprints: ["set1-114"],
  cardType: "character",
  name: "Maui",
  version: "Hero to All",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "001",
  cardNumber: 114,
  rarity: "rare",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_f839f8a7cb9a47ae962503f3ea69bec5",
    tcgPlayer: 510158,
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "Reckless",
    },
  ],
  classifications: ["Storyborn", "Hero", "Deity"],
  abilities: [rush, reckless],
  i18n: mauiHeroToAllI18n,
};
