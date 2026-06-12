import type { ActionCard } from "@tcg/lorcana-types";
import { iWillFindMyWayI18n } from "./095-i-will-find-my-way.i18n";

export const iWillFindMyWay: ActionCard = {
  id: "iQ6",
  canonicalId: "ci_iQ6",
  reprints: ["set3-095"],
  cardType: "action",
  name: "I Will Find My Way",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "003",
  cardNumber: 95,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_699c0e28637945e0a2ad8698e9695bb0",
    tcgPlayer: 538723,
  },
  text: "Chosen character of yours gets +2 {S} this turn. They may move to a location for free.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            duration: "this-turn",
            stat: "strength",
            modifier: 2,
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "you",
              selector: "chosen",
              zones: ["play"],
            },
          },
          {
            type: "optional",
            effect: {
              type: "move-to-location",
              cost: "free",
              character: {
                ref: "previous-target",
              },
              location: {
                cardTypes: ["location"],
                count: 1,
                owner: "you",
                selector: "chosen",
                zones: ["play"],
              },
            },
          },
        ],
      },
    },
  ],
  i18n: iWillFindMyWayI18n,
};
