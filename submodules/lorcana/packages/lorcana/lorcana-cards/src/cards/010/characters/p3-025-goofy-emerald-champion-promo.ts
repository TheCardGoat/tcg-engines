import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyEmeraldChampionP3PromoI18n } from "./p3-025-goofy-emerald-champion-promo.i18n";

export const goofyEmeraldChampionP3Promo: CharacterCard = {
  id: "Q7m",
  canonicalId: "ci_NDq",
  slug: "lorcana-ci_NDq",
  printings: [
    {
      id: "set10-p3-025-promo",
      artId: "ci_NDq-promo",
      setCode: "set10",
      collectorNumber: "25",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set10-091"],
  cardType: "character",
  name: "Goofy",
  version: "Emerald Champion",
  inkType: ["emerald"],
  set: "010",
  cardNumber: 25,
  rarity: "special",
  specialRarity: "promo",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_eade7bfcfdcf4189a0cc13d7ca4bb7ae",
    tcgPlayer: "658463",
  },
  text: [
    {
      title: "EVEN THE SCORE",
      description:
        "Whenever one of your other Emerald characters is challenged and banished, banish the challenging character.",
    },
    {
      title: "PROVIDE COVER",
      description: "Your other Emerald characters gain Ward.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      id: "bau-1",
      text: "EVEN THE SCORE Whenever one of your other Emerald characters is challenged and banished, banish the challenging character.",
      name: "EVEN THE SCORE",
      effect: {
        target: {
          ref: "attacker",
        },
        type: "banish",
      },
      trigger: {
        challengeContext: {
          role: "defender",
        },
        event: "challenged-and-banished",
        on: {
          controller: "you",
          cardType: "character",
          excludeSelf: true,
          filters: [
            {
              type: "ink-type",
              inkType: "emerald",
            },
          ],
        },
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      id: "bau-2",
      text: "PROVIDE COVER Your other Emerald characters gain Ward.",
      name: "PROVIDE COVER",
      effect: {
        keyword: "Ward",
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "you",
          selector: "all",
          zones: ["play"],
          excludeSelf: true,
          filter: [
            {
              type: "ink-type",
              inkType: "emerald",
            },
          ],
        },
        type: "gain-keyword",
      },
      type: "static",
    },
  ],
  i18n: goofyEmeraldChampionP3PromoI18n,
};
