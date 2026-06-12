import type { ActionCard } from "@tcg/lorcana-types";
import { showMeMoreI18n } from "./082-show-me-more.i18n";

export const showMeMore: ActionCard = {
  id: "475",
  canonicalId: "ci_Jte",
  reprints: ["set7-082"],
  cardType: "action",
  name: "Show Me More!",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "007",
  cardNumber: 82,
  rarity: "common",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_29df1d46e9f9463f9058c264f7b3bbd5",
    tcgPlayer: 619739,
  },
  text: "Each player draws 3 cards.",
  abilities: [
    {
      id: "11i-1",
      effect: {
        amount: 3,
        target: "EACH_PLAYER",
        type: "draw",
      },
      type: "action",
      text: "Each player draws 3 cards.",
    },
  ],
  i18n: showMeMoreI18n,
};
