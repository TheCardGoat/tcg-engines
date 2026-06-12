import type { ActionCard } from "@tcg/lorcana-types";
import { legendOfTheSwordInTheStoneI18n } from "./064-legend-of-the-sword-in-the-stone.i18n";

export const legendOfTheSwordInTheStone: ActionCard = {
  id: "Sw8",
  canonicalId: "ci_Sw8",
  reprints: ["set2-064"],
  cardType: "action",
  name: "Legend of the Sword in the Stone",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  cardNumber: 64,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_d4eaff075b2b41659976e71933d2c3e4",
    tcgPlayer: 526302,
  },
  text: "Chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        type: "gain-keyword",
        value: 3,
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
  i18n: legendOfTheSwordInTheStoneI18n,
};
