import type { CharacterCard } from "@tcg/lorcana-types";
import { vixeyExpertFisherPD1PromoI18n } from "./pd1-004-vixey-expert-fisher-promo.i18n";

export const vixeyExpertFisherPD1Promo: CharacterCard = {
  id: "iYJ",
  canonicalId: "ci_iYJ",
  slug: "lorcana-ci_iYJ",
  printings: [
    {
      id: "set13-pd1-004-promo",
      artId: "ci_iYJ-promo",
      setCode: "set13",
      collectorNumber: "4",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set13-046"],
  cardType: "character",
  name: "Vixey",
  version: "Expert Fisher",
  inkType: ["amethyst"],
  franchise: "Fox and the Hound",
  set: "013",
  cardNumber: 4,
  rarity: "special",
  specialRarity: "promo",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Stealing In",
      description:
        "When you play this character, if you have a character with Evasive in play, you may return chosen character, item, or location with cost 2 or less to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      type: "triggered",
      name: "STEALING IN",
      text: "STEALING IN When you play this character, if you have a character with Evasive in play, you may return chosen character, item, or location with cost 2 or less to their player's hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "has-keyword",
              keyword: "Evasive",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character", "item", "location"],
            filter: [
              {
                type: "cost-comparison",
                comparison: "less-or-equal",
                value: 2,
              },
            ],
          },
        },
      },
    },
  ],
  i18n: vixeyExpertFisherPD1PromoI18n,
};
