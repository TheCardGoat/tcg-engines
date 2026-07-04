import type { CharacterCard } from "@tcg/lorcana-types";
import { dashParrLavaRunnerP3PromoI18n } from "./p3-052-dash-parr-lava-runner-promo.i18n";

import { rush } from "../../../helpers/abilities/rush";

export const dashParrLavaRunnerP3Promo: CharacterCard = {
  id: "Z65",
  canonicalId: "ci_W3N",
  slug: "lorcana-ci_W3N",
  printings: [
    {
      id: "set12-p3-052-promo",
      artId: "ci_W3N-promo",
      setCode: "set12",
      collectorNumber: "52",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set12-061"],
  cardType: "character",
  name: "Dash Parr",
  version: "Lava Runner",
  inkType: ["amethyst"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 52,
  rarity: "special",
  specialRarity: "promo",
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_cdc217218de441d8b92b3ea9c8041cab",
    tcgPlayer: "690529",
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "RECORD TIME",
      description: "This character can quest the turn he's played.",
    },
  ],
  classifications: ["Storyborn", "Super", "Hero"],
  abilities: [
    rush,
    {
      id: "vhe-2",
      name: "RECORD TIME",
      type: "static",
      text: "RECORD TIME This character can quest the turn he's played.",
      effect: {
        type: "restriction",
        restriction: "can-quest-turn-played",
        target: "SELF",
      },
    },
  ],
  i18n: dashParrLavaRunnerP3PromoI18n,
};
