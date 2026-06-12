import type { CharacterCard } from "@tcg/lorcana-types";
import { daisyDuckSpotlessFoodfighterI18n } from "./111-daisy-duck-spotless-food-fighter.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const daisyDuckSpotlessFoodfighter: CharacterCard = {
  id: "wsY",
  canonicalId: "ci_wsY",
  reprints: ["set5-111"],
  cardType: "character",
  name: "Daisy Duck",
  version: "Spotless Food-Fighter",
  inkType: ["ruby"],
  set: "005",
  cardNumber: 111,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_bfe946722b9545b996eac2d8d5e13dfd",
    tcgPlayer: 561482,
  },
  text: "Evasive",
  classifications: ["Storyborn", "Hero"],
  abilities: [evasive],
  i18n: daisyDuckSpotlessFoodfighterI18n,
};
