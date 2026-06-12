import type { CharacterCard } from "@tcg/lorcana-types";
import { aladdinFearlessNavigatorI18n } from "./112-aladdin-fearless-navigator.i18n";

export const aladdinFearlessNavigator: CharacterCard = {
  id: "4X3",
  canonicalId: "ci_4X3",
  reprints: ["set6-112"],
  cardType: "character",
  name: "Aladdin",
  version: "Fearless Navigator",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "006",
  cardNumber: 112,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_8f39dbce50c045b49ae76f290eedd29c",
    tcgPlayer: 592998,
  },
  classifications: ["Storyborn", "Hero", "Prince"],
  i18n: aladdinFearlessNavigatorI18n,
};
