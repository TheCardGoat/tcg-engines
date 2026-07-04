import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckMusketeerP1PromoI18n } from "./p1-013-donald-duck-musketeer-promo.i18n";

import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const donaldDuckMusketeerP1Promo: CharacterCard = {
  id: "bXy",
  canonicalId: "ci_DOw",
  slug: "lorcana-ci_DOw",
  printings: [
    {
      id: "set1-p1-013-promo",
      artId: "ci_DOw-promo",
      setCode: "set1",
      collectorNumber: "13",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set1-177"],
  cardType: "character",
  name: "Donald Duck",
  version: "Musketeer",
  inkType: ["steel"],
  set: "001",
  cardNumber: 13,
  rarity: "special",
  specialRarity: "promo",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e854c2e94f504118b3618ae2eb10a195",
    tcgPlayer: "508907",
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "STAY ALERT!",
      description:
        "During your turn, your Musketeer characters gain Evasive. (They can challenge characters with Evasive.)",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Musketeer"],
  abilities: [
    bodyguard,
    {
      condition: {
        type: "during-turn",
        whose: "your",
      },
      effect: {
        keyword: "Evasive",
        target: {
          count: "all",
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Musketeer",
            },
          ],
        },
        type: "gain-keyword",
      },
      id: "1te-2",
      name: "STAY ALERT!",
      text: "STAY ALERT! During your turn, your Musketeer characters gain Evasive.",
      type: "static",
    },
  ],
  i18n: donaldDuckMusketeerP1PromoI18n,
};
