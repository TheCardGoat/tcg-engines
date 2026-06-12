import type { CharacterCard } from "@tcg/lorcana-types";
import { panicImmortalSidekickI18n } from "./082-panic-immortal-sidekick.i18n";

export const panicImmortalSidekick: CharacterCard = {
  id: "AcX",
  canonicalId: "ci_AcX",
  reprints: ["set4-082"],
  cardType: "character",
  name: "Panic",
  version: "Immortal Sidekick",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "004",
  cardNumber: 82,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_3b8a6e3644374d98828747b29622e053",
    tcgPlayer: 550579,
  },
  text: [
    {
      title: "REPORTING FOR DUTY",
      description:
        "While this character is exerted, if you have a character named Pain in play, your Villain characters can't be challenged.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "and",
        conditions: [
          { type: "is-exerted" },
          { type: "has-named-character", name: "Pain", controller: "you" },
        ],
      },
      effect: {
        restriction: "cant-be-challenged",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [{ type: "has-classification", classification: "Villain" }],
        },
        type: "restriction",
      },
      id: "1bf-1",
      name: "REPORTING FOR DUTY",
      text: "REPORTING FOR DUTY While this character is exerted, if you have a character named Pain in play, your Villain characters can't be challenged.",
      type: "static",
    },
  ],
  i18n: panicImmortalSidekickI18n,
};
