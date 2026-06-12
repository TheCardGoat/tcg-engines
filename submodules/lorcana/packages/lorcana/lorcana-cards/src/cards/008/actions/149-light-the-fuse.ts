import type { ActionCard } from "@tcg/lorcana-types";
import { lightTheFuseI18n } from "./149-light-the-fuse.i18n";

export const lightTheFuse: ActionCard = {
  id: "Gsc",
  canonicalId: "ci_Gsc",
  reprints: ["set8-149"],
  cardType: "action",
  name: "Light the Fuse",
  inkType: ["ruby", "steel"],
  franchise: "Mulan",
  set: "008",
  cardNumber: 149,
  rarity: "uncommon",
  cost: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_e416c26c509b4f3eb41a49cf0d478734",
    tcgPlayer: 631449,
  },
  text: "Deal 1 damage to chosen character for each exerted character you have in play.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: {
          counter: {
            controller: "you",
            type: "exerted-characters",
          },
          type: "for-each",
        },
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
  i18n: lightTheFuseI18n,
};
