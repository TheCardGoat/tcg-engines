import type { ActionCard } from "@tcg/lorcana-types";
import { mostEveryonesMadHereI18n } from "./151-most-everyones-mad-here.i18n";

export const mostEveryonesMadHere: ActionCard = {
  id: "FLL",
  canonicalId: "ci_FLL",
  reprints: ["set8-151"],
  cardType: "action",
  name: "Most Everyone's Mad Here",
  inkType: ["ruby"],
  franchise: "Alice in Wonderland",
  set: "008",
  cardNumber: 151,
  rarity: "rare",
  cost: 7,
  inkable: false,
  externalIds: {
    lorcast: "crd_bc307680b7a247268c3e25f80be90450",
    tcgPlayer: 631451,
  },
  text: "Gain lore equal to the damage on chosen character, then banish them.",
  abilities: [
    {
      type: "action",
      effect: {
        steps: [
          {
            counter: {
              type: "damage-on-target",
            },
            effect: {
              amount: 1,
              target: "CONTROLLER",
              type: "gain-lore",
            },
            target: "CHOSEN_CHARACTER",
            type: "for-each",
          },
          {
            target: {
              ref: "previous-target",
            },
            type: "banish",
          },
        ],
        type: "sequence",
      },
    },
  ],
  i18n: mostEveryonesMadHereI18n,
};
