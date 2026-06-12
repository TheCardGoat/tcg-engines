import type { ActionCard } from "@tcg/lorcana-types";
import { everAsBeforeI18n } from "./162-ever-as-before.i18n";

export const everAsBefore: ActionCard = {
  id: "DPw",
  canonicalId: "ci_DPw",
  reprints: ["set5-162"],
  cardType: "action",
  name: "Ever as Before",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "005",
  cardNumber: 162,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_127dc81d93624162b4eee478a2f33f5a",
    tcgPlayer: 561970,
  },
  text: "Remove up to 2 damage from any number of chosen characters.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        amount: { type: "up-to", value: 2 },
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "remove-damage",
      },
      id: "1br-1",
      text: "Remove up to 2 damage from any number of chosen characters.",
      type: "action",
    },
  ],
  i18n: everAsBeforeI18n,
};
