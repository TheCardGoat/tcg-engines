import type { ItemCard } from "@tcg/lorcana-types";
import { iceSpikesI18n } from "./084-ice-spikes.i18n";

export const iceSpikes: ItemCard = {
  id: "zHC",
  canonicalId: "ci_zHC",
  reprints: ["set8-084"],
  cardType: "item",
  name: "Ice Spikes",
  inkType: ["amethyst", "sapphire"],
  franchise: "Frozen",
  set: "008",
  cardNumber: 84,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f045d7f21ccd4cbe8ffb41e436759221",
    tcgPlayer: 631405,
  },
  text: [
    {
      title: "HOLD STILL",
      description: "When you play this item, exert chosen opposing character.",
    },
    {
      title: "IT'S STUCK",
      description:
        "{E}, 1 {I} — Exert chosen opposing item. It can't ready at the start of its next turn.",
    },
  ],
  abilities: [
    {
      id: "1w9-1",
      name: "HOLD STILL",
      text: "HOLD STILL When you play this item, exert chosen opposing character.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "exert",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
    {
      id: "1w9-2",
      name: "IT'S STUCK",
      text: "IT'S STUCK {E}, 1 {I} — Exert chosen opposing item. It can't ready at the start of its next turn.",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "exert",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["item"],
            },
          },
          {
            type: "restriction",
            restriction: "cant-ready",
            duration: "until-start-of-next-turn",
            target: {
              ref: "previous-target",
            },
          },
        ],
      },
    },
  ],
  i18n: iceSpikesI18n,
};
