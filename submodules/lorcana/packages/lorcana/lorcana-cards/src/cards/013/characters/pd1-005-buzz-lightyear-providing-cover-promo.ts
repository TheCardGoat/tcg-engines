import type { CharacterCard } from "@tcg/lorcana-types";
import { buzzLightyearProvidingCoverPD1PromoI18n } from "./pd1-005-buzz-lightyear-providing-cover-promo.i18n";

export const buzzLightyearProvidingCoverPD1Promo: CharacterCard = {
  id: "cAP",
  canonicalId: "ci_cAP",
  slug: "lorcana-ci_cAP",
  printings: [
    {
      id: "set13-pd1-005-promo",
      artId: "ci_cAP-promo",
      setCode: "set13",
      collectorNumber: "5",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set13-077"],
  cardType: "character",
  name: "Buzz Lightyear",
  version: "Providing Cover",
  inkType: ["emerald"],
  franchise: "Toy Story",
  set: "013",
  cardNumber: 5,
  rarity: "special",
  specialRarity: "promo",
  cost: 4,
  strength: 4,
  willpower: 2,
  lore: 2,
  inkable: false,
  text: [
    {
      title: "Action Figure",
      description:
        "When you play this character, choose one of the following. If you have another Toy character in play, choose both instead:",
    },
    {
      title: "• You may return an action card with cost 2 or less from your discard to your hand.",
    },
    {
      title: "• You may play an action with cost 2 or less for free.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Toy", "Captain"],
  abilities: [
    {
      type: "triggered",
      name: "ACTION FIGURE",
      text: "ACTION FIGURE When you play this character, choose one of the following. If you have another Toy character in play, choose both instead.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "has-character-count",
          controller: "you",
          comparison: "greater-or-equal",
          count: 2,
          classification: "Toy",
        },
        then: {
          type: "sequence",
          steps: [
            {
              type: "optional",
              chooser: "CONTROLLER",
              effect: {
                type: "return-from-discard",
                target: "CONTROLLER",
                count: 1,
                cardType: "action",
                costRestriction: {
                  comparison: "less-or-equal",
                  value: 2,
                },
              },
            },
            {
              type: "optional",
              chooser: "CONTROLLER",
              effect: {
                type: "play-card",
                from: "hand",
                cardType: "action",
                cost: "free",
                costRestriction: {
                  comparison: "less-or-equal",
                  value: 2,
                },
              },
            },
          ],
        },
        else: {
          type: "choice",
          chooser: "CONTROLLER",
          options: [
            {
              type: "optional",
              chooser: "CONTROLLER",
              effect: {
                type: "return-from-discard",
                target: "CONTROLLER",
                count: 1,
                cardType: "action",
                costRestriction: {
                  comparison: "less-or-equal",
                  value: 2,
                },
              },
            },
            {
              type: "optional",
              chooser: "CONTROLLER",
              effect: {
                type: "play-card",
                from: "hand",
                cardType: "action",
                cost: "free",
                costRestriction: {
                  comparison: "less-or-equal",
                  value: 2,
                },
              },
            },
          ],
        },
      },
    },
  ],
  i18n: buzzLightyearProvidingCoverPD1PromoI18n,
};
