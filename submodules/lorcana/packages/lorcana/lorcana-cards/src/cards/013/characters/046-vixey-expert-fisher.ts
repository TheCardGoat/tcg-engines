import type { CharacterCard } from "@tcg/lorcana-types";
import { vixeyExpertFisherI18n } from "./046-vixey-expert-fisher.i18n";

export const vixeyExpertFisher: CharacterCard = {
  id: "NS7",
  canonicalId: "ci_iYJ",
  slug: "lorcana-ci_iYJ",
  printings: [
    {
      id: "set13-046",
      artId: "set13-046",
      setCode: "set13",
      collectorNumber: "46",
      rarity: "rare",
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
  cardNumber: 46,
  rarity: "rare",
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
  i18n: vixeyExpertFisherI18n,
};
