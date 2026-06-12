import type { ActionCard } from "@tcg/lorcana-types";
import { hasSetMyHeaaaaaaartI18n } from "./094-has-set-my-heaaaaaaart.i18n";

export const hasSetMyHeaaaaaaart: ActionCard = {
  id: "1gW",
  canonicalId: "ci_1gW",
  reprints: ["set3-094"],
  cardType: "action",
  name: "Has Set My Heaaaaaaart . . .",
  inkType: ["emerald"],
  set: "003",
  cardNumber: 94,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_86e375807dee4e26ab3254c11e7eed00",
    tcgPlayer: 539085,
  },
  text: "(A character with cost 2 or more can to play this song for free.) Banish chosen item.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["item"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
      type: "action",
    },
  ],
  i18n: hasSetMyHeaaaaaaartI18n,
};
