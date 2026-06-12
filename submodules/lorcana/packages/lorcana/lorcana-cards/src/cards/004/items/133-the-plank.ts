import type { ItemCard } from "@tcg/lorcana-types";
import { thePlankI18n } from "./133-the-plank.i18n";

export const thePlank: ItemCard = {
  id: "PlS",
  canonicalId: "ci_PlS",
  reprints: ["set4-133"],
  cardType: "item",
  name: "The Plank",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "004",
  cardNumber: 133,
  rarity: "common",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_20286eaca8e44e0c8527a00bf07be1c7",
    tcgPlayer: 550603,
  },
  text: [
    {
      title: "WALK! 2",
      description: "{I}, Banish this item — Choose one:",
    },
    {
      title: "• Banish chosen Hero character.",
    },
    {
      title: "• Ready chosen Villain character. They can't quest for the rest of this turn.",
    },
  ],
  abilities: [
    {
      id: "iv0-1",
      name: "WALK!",
      text: "WALK! 2 {I}, Banish this item — Choose one: • Banish chosen Hero character. • Ready chosen Villain character. They can't quest for the rest of this turn.",
      type: "activated",
      cost: {
        ink: 2,
        banishSelf: true,
      },
      effect: {
        type: "choice",
        options: [
          {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "has-classification",
                  classification: "Hero",
                },
              ],
            },
          },
          {
            type: "sequence",
            steps: [
              {
                type: "ready",
                target: {
                  selector: "chosen",
                  count: 1,
                  owner: "any",
                  zones: ["play"],
                  cardTypes: ["character"],
                  filter: [
                    {
                      type: "has-classification",
                      classification: "Villain",
                    },
                  ],
                },
              },
              {
                type: "restriction",
                restriction: "cant-quest",
                duration: "this-turn",
                target: {
                  ref: "previous-target",
                },
              },
            ],
          },
        ],
      },
    },
  ],
  i18n: thePlankI18n,
};
