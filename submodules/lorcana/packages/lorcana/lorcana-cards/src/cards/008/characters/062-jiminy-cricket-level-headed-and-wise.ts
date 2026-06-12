import type { CharacterCard } from "@tcg/lorcana-types";
import { jiminyCricketLevelheadedAndWiseI18n } from "./062-jiminy-cricket-level-headed-and-wise.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const jiminyCricketLevelheadedAndWise: CharacterCard = {
  id: "JE3",
  canonicalId: "ci_JE3",
  reprints: ["set8-062"],
  cardType: "character",
  name: "Jiminy Cricket",
  version: "Level-Headed and Wise",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "008",
  cardNumber: 62,
  rarity: "rare",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c9470722efc54fbbad1e2485e03b52c2",
    tcgPlayer: 631392,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "ENOUGH'S ENOUGH",
      description:
        "While this character is exerted, opposing characters with Rush enter play exerted.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
  abilities: [
    evasive,
    {
      condition: {
        type: "is-exerted",
      },
      effect: {
        restriction: "enters-play-exerted",
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [{ type: "has-keyword", keyword: "Rush" }],
        },
        type: "restriction",
      },
      id: "1i2-2",
      name: "ENOUGH'S ENOUGH",
      text: "ENOUGH'S ENOUGH While this character is exerted, opposing characters with Rush enter play exerted.",
      type: "static",
    },
  ],
  i18n: jiminyCricketLevelheadedAndWiseI18n,
};
