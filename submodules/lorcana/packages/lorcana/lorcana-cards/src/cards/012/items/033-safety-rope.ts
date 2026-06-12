import type { ItemCard } from "@tcg/lorcana-types";
import { safetyRopeI18n } from "./033-safety-rope.i18n";

export const safetyRope: ItemCard = {
  id: "m5E",
  canonicalId: "ci_m5E",
  reprints: ["set12-033"],
  cardType: "item",
  name: "Safety Rope",
  inkType: ["amber"],
  franchise: "Lorcana",
  set: "012",
  cardNumber: 33,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_4405683c633a4d20843d6dc55a9a04d9",
  },
  text: [
    {
      title: "GRAB HOLD!",
      description:
        "When you play this item, you may put a character card from your discard on the top of your deck.",
    },
    {
      title: "PACK IT UP",
      description: "At the end of your turn, you may banish this item to draw a card.",
    },
  ],
  abilities: [
    {
      id: "m5E-1",
      name: "GRAB HOLD!",
      text: "GRAB HOLD! When you play this item, you may put a character card from your discard on the top of your deck.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "return-from-discard",
          cardType: "character",
          destination: "top-of-deck",
          target: "CONTROLLER",
          count: 1,
        },
      },
    },
    {
      id: "m5E-2",
      name: "PACK IT UP",
      text: "PACK IT UP At the end of your turn, you may banish this item to draw a card.",
      type: "triggered",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "banish",
              target: "THIS_ITEM",
            },
            {
              type: "draw",
              amount: 1,
              target: "CONTROLLER",
            },
          ],
        },
      },
    },
  ],
  i18n: safetyRopeI18n,
};
