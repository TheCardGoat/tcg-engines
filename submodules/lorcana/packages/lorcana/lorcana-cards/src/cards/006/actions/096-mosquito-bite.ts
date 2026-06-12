import type { ActionCard } from "@tcg/lorcana-types";
import { mosquitoBiteI18n } from "./096-mosquito-bite.i18n";

export const mosquitoBite: ActionCard = {
  id: "wew",
  canonicalId: "ci_wew",
  reprints: ["set6-096"],
  cardType: "action",
  name: "Mosquito Bite",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 96,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b2f167a1614348f194ac43b390bd7fe1",
    tcgPlayer: 592021,
  },
  text: "Put 1 damage counter on chosen character.",
  abilities: [
    {
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "put-damage",
      },
      type: "action",
    },
  ],
  i18n: mosquitoBiteI18n,
};
