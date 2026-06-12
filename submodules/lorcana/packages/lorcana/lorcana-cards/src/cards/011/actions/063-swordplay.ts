import type { ActionCard } from "@tcg/lorcana-types";
import { swordplayI18n } from "./063-swordplay.i18n";

export const swordplay: ActionCard = {
  id: "7uF",
  canonicalId: "ci_7uF",
  reprints: ["set11-063"],
  cardType: "action",
  name: "Swordplay",
  inkType: ["amethyst"],
  franchise: "Black Cauldron",
  set: "011",
  cardNumber: 63,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_79bedff3158647f791e28faa270773b5",
    tcgPlayer: 675299,
  },
  text: "Chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
  abilities: [
    {
      type: "action",
      text: "Chosen character gains Challenger +3 this turn.",
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 3,
        duration: "this-turn",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
  i18n: swordplayI18n,
};
