import type { ActionCard } from "@tcg/lorcana-types";
import { theBeastIsMineI18n } from "./099-the-beast-is-mine.i18n";

export const theBeastIsMine: ActionCard = {
  id: "4uS",
  canonicalId: "ci_4uS",
  reprints: ["set1-099"],
  cardType: "action",
  name: "The Beast is Mine!",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "001",
  cardNumber: 99,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_7c0b98be9394466198db3610a9b64953",
    tcgPlayer: 494154,
  },
  text: "Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  abilities: [
    {
      type: "action",
      effect: {
        duration: "their-next-turn",
        keyword: "Reckless",
        type: "gain-keyword",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
  i18n: theBeastIsMineI18n,
};
