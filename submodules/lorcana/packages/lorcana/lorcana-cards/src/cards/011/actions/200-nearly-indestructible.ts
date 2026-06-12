import type { ActionCard } from "@tcg/lorcana-types";
import { nearlyIndestructibleI18n } from "./200-nearly-indestructible.i18n";

export const nearlyIndestructible: ActionCard = {
  id: "xnF",
  canonicalId: "ci_xnF",
  reprints: ["set11-200"],
  cardType: "action",
  name: "Nearly Indestructible",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 200,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_60d34f2b1b38499e8f7a5915a0a7e59c",
    tcgPlayer: 676248,
  },
  text: "Chosen character of yours gains Resist +2 until the start of your next turn.",
  abilities: [
    {
      type: "action",
      text: "Chosen character of yours gains Resist +2 until the start of your next turn.",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 2,
        duration: "until-start-of-next-turn",
        target: "CHOSEN_CHARACTER_OF_YOURS",
      },
    },
  ],
  i18n: nearlyIndestructibleI18n,
};
