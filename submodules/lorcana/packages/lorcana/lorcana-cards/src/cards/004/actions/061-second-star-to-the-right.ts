import type { ActionCard } from "@tcg/lorcana-types";
import { secondStarToTheRightI18n } from "./061-second-star-to-the-right.i18n";

export const secondStarToTheRight: ActionCard = {
  id: "v0N",
  canonicalId: "ci_oGQ",
  reprints: ["set4-061", "set9-060"],
  cardType: "action",
  name: "Second Star to the Right",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "004",
  cardNumber: 61,
  rarity: "rare",
  cost: 10,
  inkable: false,
  externalIds: {
    lorcast: "crd_07d43fd911d2476caa9c4aa982d29405",
    tcgPlayer: 650004,
  },
  text: [
    {
      title: "Sing Together 10",
      description:
        "(Any number of your or your teammates' characters with total cost 10 or more may {E} to sing this song for free.)",
    },
    {
      title: "Chosen player draws 5 cards.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "draw",
        amount: 5,
        target: "CHOSEN_PLAYER",
      },
    },
  ],
  i18n: secondStarToTheRightI18n,
};
