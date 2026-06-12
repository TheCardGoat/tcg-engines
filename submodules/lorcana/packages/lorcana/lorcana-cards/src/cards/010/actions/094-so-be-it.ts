import type { ActionCard } from "@tcg/lorcana-types";
import { soBeItI18n } from "./094-so-be-it.i18n";

export const soBeIt: ActionCard = {
  id: "L16",
  canonicalId: "ci_L16",
  reprints: ["set10-094"],
  cardType: "action",
  name: "So Be It!",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "010",
  cardNumber: 94,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_758f17fbfa45410ab196cc29a03a4c45",
    tcgPlayer: 658462,
  },
  text: "Each of your characters gets +1 {S} this turn. You may banish chosen item.",
  abilities: [
    {
      effect: {
        steps: [
          {
            duration: "this-turn",
            modifier: 1,
            stat: "strength",
            target: "YOUR_CHARACTERS",
            type: "modify-stat",
          },
          {
            chooser: "CONTROLLER",
            effect: {
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["item"],
              },
              type: "banish",
            },
            type: "optional",
          },
        ],
        type: "sequence",
      },
      type: "action",
    },
  ],
  i18n: soBeItI18n,
};
