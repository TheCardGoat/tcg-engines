import type { ActionCard } from "@tcg/lorcana-types";
import { iveGotADreamI18n } from "./129-ive-got-a-dream.i18n";

export const iveGotADream: ActionCard = {
  id: "aTe",
  canonicalId: "ci_aTe",
  reprints: ["set3-129"],
  cardType: "action",
  name: "I've Got a Dream",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "003",
  cardNumber: 129,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_980a374d3ce34527868e0f78b48f63c6",
    tcgPlayer: 531825,
  },
  text: "Ready chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location's {L}.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
              filter: [
                {
                  type: "at-location",
                },
              ],
            },
          },
          {
            type: "restriction",
            duration: "this-turn",
            restriction: "cant-quest",
            target: {
              ref: "previous-target",
            },
          },
          {
            type: "gain-lore",
            target: "CARD_OWNER",
            amount: {
              type: "target-location-attribute",
              attribute: "lore",
            },
          },
        ],
      },
    },
  ],
  i18n: iveGotADreamI18n,
};
