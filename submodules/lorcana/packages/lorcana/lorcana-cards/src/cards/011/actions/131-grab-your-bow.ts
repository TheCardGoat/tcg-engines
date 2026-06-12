import type { ActionCard } from "@tcg/lorcana-types";
import { grabYourBowI18n } from "./131-grab-your-bow.i18n";

export const grabYourBow: ActionCard = {
  id: "EtL",
  canonicalId: "ci_EtL",
  reprints: ["set11-131"],
  cardType: "action",
  name: "Grab Your Bow",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "011",
  cardNumber: 131,
  rarity: "uncommon",
  cost: 5,
  inkable: false,
  externalIds: {
    lorcast: "crd_4bf208bd16b043ac8eb27209b522c3c6",
    tcgPlayer: 675343,
  },
  text: "Banish up to 2 chosen characters with 2 {S} or less.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Banish up to 2 chosen characters with 2 {S} or less.",
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: {
            upTo: 2,
          },
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "strength-comparison",
              comparison: "less-or-equal",
              value: 2,
            },
          ],
        },
      },
    },
  ],
  i18n: grabYourBowI18n,
};
