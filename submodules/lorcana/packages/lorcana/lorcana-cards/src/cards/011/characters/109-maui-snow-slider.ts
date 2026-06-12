import type { CharacterCard } from "@tcg/lorcana-types";
import { mauiSnowSliderI18n } from "./109-maui-snow-slider.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const mauiSnowSlider: CharacterCard = {
  id: "1ji",
  canonicalId: "ci_1ji",
  reprints: ["set11-109"],
  cardType: "character",
  name: "Maui",
  version: "Snow Slider",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "011",
  cardNumber: 109,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_d6b606b2691f493bb74f2faf13339c28",
    tcgPlayer: 675498,
  },
  text: "Rush",
  classifications: ["Storyborn", "Hero", "Deity"],
  abilities: [rush],
  i18n: mauiSnowSliderI18n,
};
