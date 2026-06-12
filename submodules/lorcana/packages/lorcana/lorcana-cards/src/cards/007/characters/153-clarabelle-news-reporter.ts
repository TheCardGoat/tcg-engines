import type { CharacterCard } from "@tcg/lorcana-types";
import { clarabelleNewsReporterI18n } from "./153-clarabelle-news-reporter.i18n";
import { support } from "../../../helpers/abilities/support";

export const clarabelleNewsReporter: CharacterCard = {
  id: "ykh",
  canonicalId: "ci_ykh",
  reprints: ["set7-153"],
  cardType: "character",
  name: "Clarabelle",
  version: "News Reporter",
  inkType: ["sapphire"],
  set: "007",
  cardNumber: 153,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0ae6751e22074e8fb6bfe871c4f44f3e",
    tcgPlayer: 618711,
  },
  text: [
    {
      title: "Support",
    },
    {
      title: "BREAKING STORY",
      description: "Your other characters with Support get +1 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    support,
    {
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
          filters: [{ type: "has-keyword", keyword: "Support" }],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        modifier: 1,
        stat: "strength",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
          filter: [{ type: "has-keyword", keyword: "Support" }],
        },
        type: "modify-stat",
      },
      id: "1r6-2",
      name: "BREAKING STORY",
      text: "BREAKING STORY Your other characters with Support get +1 {S}.",
      type: "static",
    },
  ],
  i18n: clarabelleNewsReporterI18n,
};
