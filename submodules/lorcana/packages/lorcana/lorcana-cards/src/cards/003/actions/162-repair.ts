import type { ActionCard } from "@tcg/lorcana-types";
import { repairI18n } from "./162-repair.i18n";

export const repair: ActionCard = {
  id: "2j4",
  canonicalId: "ci_2j4",
  reprints: ["set3-162"],
  cardType: "action",
  name: "Repair",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "003",
  cardNumber: 162,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_e2433a86940b43e8ac63f6eeddedf085",
    tcgPlayer: 538305,
  },
  text: "Remove up to 3 damage from one of your locations or characters.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "remove-damage",
        amount: { type: "up-to", value: 3 },
        target: {
          cardTypes: ["location", "character"],
          count: 1,
          owner: "you",
          selector: "chosen",
          zones: ["play"],
        },
      },
    },
  ],
  i18n: repairI18n,
};
