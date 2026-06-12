import type { ActionCard } from "@tcg/lorcana-types";
import { onlySoMuchRoomI18n } from "./041-only-so-much-room.i18n";

export const onlySoMuchRoom: ActionCard = {
  id: "fR9",
  canonicalId: "ci_fR9",
  reprints: ["set8-041"],
  cardType: "action",
  name: "Only So Much Room",
  inkType: ["amber", "emerald"],
  franchise: "Lady and the Tramp",
  set: "008",
  cardNumber: 41,
  rarity: "uncommon",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_2085340ba83e4380a30c2451823aa80e",
    tcgPlayer: 631379,
  },
  text: "Return chosen character with 2 {S} or less to their player's hand. Return a character card from your discard to your hand.",
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              selector: "chosen",
              count: 1,
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
            type: "return-to-hand",
          },
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["discard"],
              cardTypes: ["character"],
            },
            type: "return-to-hand",
          },
        ],
        type: "sequence",
      },
      id: "12f-1",
      text: "Return chosen character with 2 {S} or less to their player's hand. Return a character card from your discard to your hand.",
      type: "action",
    },
  ],
  i18n: onlySoMuchRoomI18n,
};
