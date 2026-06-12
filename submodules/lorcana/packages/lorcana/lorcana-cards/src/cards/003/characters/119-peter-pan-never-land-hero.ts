import type { CharacterCard } from "@tcg/lorcana-types";
import { peterPanNeverLandHeroI18n } from "./119-peter-pan-never-land-hero.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const peterPanNeverLandHero: CharacterCard = {
  id: "kk3",
  canonicalId: "ci_kk3",
  reprints: ["set3-119"],
  cardType: "character",
  name: "Peter Pan",
  version: "Never Land Hero",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "003",
  cardNumber: 119,
  rarity: "common",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ffccea571e7e4efb9b5258ecc03e847b",
    tcgPlayer: 537951,
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "OVER HERE, TINK",
      description:
        "While you have a character named Tinker Bell in play, this character gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    rush,
    {
      condition: {
        controller: "you",
        name: "Tinker Bell",
        type: "has-named-character",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "h1y-2",
      name: "OVER HERE, TINK",
      text: "OVER HERE, TINK While you have a character named Tinker Bell in play, this character gets +2 {S}.",
      type: "static",
    },
  ],
  i18n: peterPanNeverLandHeroI18n,
};
