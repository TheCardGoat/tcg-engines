import type { ItemCard } from "@tcg/lorcana-types";
import { syndromesRemoteI18n } from "./201-syndromes-remote.i18n";

export const syndromesRemote: ItemCard = {
  id: "SQl",
  canonicalId: "ci_SQl",
  reprints: ["set12-201"],
  cardType: "item",
  name: "Syndrome's Remote",
  inkType: ["steel"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 201,
  rarity: "rare",
  cost: 2,
  inkable: false,
  text: [
    {
      title: "Zero-Point Energy",
      description: "{E}, 2 {I} — Chosen character can't challenge during their next turn.",
    },
    {
      title: "Learn From Their Losses",
      description:
        "Whenever a Robot character is banished, you may banish this item to discard your hand and draw 2 cards.",
    },
  ],
  abilities: [
    {
      id: "SQl-1",
      name: "Zero-Point Energy",
      type: "activated",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "CHOSEN_CHARACTER",
        duration: "their-next-turn",
      },
      text: "Zero-Point Energy {E}, 2 {I} — Chosen character can't challenge during their next turn.",
    },
    {
      id: "SQl-2",
      name: "Learn From Their Losses",
      type: "triggered",
      trigger: {
        event: "banish",
        on: {
          cardType: "character",
          classification: "Robot",
        },
        timing: "whenever",
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
              type: "discard",
              amount: "all",
              target: "CONTROLLER",
            },
            {
              type: "draw",
              amount: 2,
              target: "CONTROLLER",
            },
          ],
        },
      },
      text: "Learn From Their Losses Whenever a Robot character is banished, you may banish this item to discard your hand and draw 2 cards.",
    },
  ],
  i18n: syndromesRemoteI18n,
};
