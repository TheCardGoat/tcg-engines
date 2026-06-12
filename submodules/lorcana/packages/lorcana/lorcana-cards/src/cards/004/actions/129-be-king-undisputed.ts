import type { ActionCard } from "@tcg/lorcana-types";
import { beKingUndisputedI18n } from "./129-be-king-undisputed.i18n";

export const beKingUndisputed: ActionCard = {
  id: "PNr",
  canonicalId: "ci_th8",
  reprints: ["set4-129", "set9-133"],
  cardType: "action",
  name: "Be King Undisputed",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "004",
  cardNumber: 129,
  rarity: "rare",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_d47a329c9f87420c8c2714ea6f7fffde",
    tcgPlayer: 650152,
  },
  text: "Each opponent chooses and banishes one of their characters.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "banish",
        chosenBy: "opponent",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: beKingUndisputedI18n,
};
