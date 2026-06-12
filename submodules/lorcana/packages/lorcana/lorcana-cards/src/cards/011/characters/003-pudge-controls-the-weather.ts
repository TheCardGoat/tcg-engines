import type { CharacterCard } from "@tcg/lorcana-types";
import { pudgeControlsTheWeatherI18n } from "./003-pudge-controls-the-weather.i18n";

export const pudgeControlsTheWeather: CharacterCard = {
  id: "IAp",
  canonicalId: "ci_IAp",
  reprints: ["set11-003"],
  cardType: "character",
  name: "Pudge",
  version: "Controls the Weather",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 3,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a862524392a1444389f95109d49ddd31",
    tcgPlayer: 674818,
  },
  text: [
    {
      title: "GOOD FRIEND",
      description:
        "If you have a character named Lilo in play, you can play this character for free.",
    },
  ],
  classifications: ["Storyborn", "Deity"],
  abilities: [
    {
      id: "wm7-1",
      condition: {
        controller: "you",
        name: "Lilo",
        type: "has-named-character",
      },
      effect: {
        amount: "full",
        type: "cost-reduction",
      },
      name: "GOOD FRIEND",
      sourceZones: ["hand"],
      text: "GOOD FRIEND If you have a character named Lilo in play, you can play this character for free.",
      type: "static",
    },
  ],
  i18n: pudgeControlsTheWeatherI18n,
};
