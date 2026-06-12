import type { ActionCard } from "@tcg/lorcana-types";
import { headsHeldHighI18n } from "./175-heads-held-high.i18n";

export const headsHeldHigh: ActionCard = {
  id: "41j",
  canonicalId: "ci_41j",
  reprints: ["set8-175"],
  cardType: "action",
  name: "Heads Held High",
  inkType: ["sapphire"],
  franchise: "Rescuers",
  set: "008",
  cardNumber: 175,
  rarity: "rare",
  cost: 6,
  inkable: true,
  externalIds: {
    lorcast: "crd_9a3f7df243294b3f9247aec8128be37a",
    tcgPlayer: 631348,
  },
  text: [
    {
      title: "Sing Together 6",
      description:
        "(Any number of your or your teammates' characters with total cost 6 or more may {E} to sing this song for free.)",
    },
    {
      title:
        "Remove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: { type: "up-to", value: 3 },
            target: {
              selector: "chosen",
              count: "all",
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "remove-damage",
          },
          {
            duration: "this-turn",
            modifier: -3,
            stat: "strength",
            target: "ALL_OPPOSING_CHARACTERS",
            type: "modify-stat",
          },
        ],
        type: "sequence",
      },
      id: "x39-1",
      text: "Sing Together 6 Remove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.",
      type: "action",
    },
  ],
  i18n: headsHeldHighI18n,
};
