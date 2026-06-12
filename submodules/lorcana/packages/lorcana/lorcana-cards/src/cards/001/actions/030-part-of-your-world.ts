import type { ActionCard } from "@tcg/lorcana-types";
import { partOfYourWorldI18n } from "./030-part-of-your-world.i18n";

export const partOfYourWorld: ActionCard = {
  id: "Vba",
  canonicalId: "ci_Vba",
  reprints: ["set1-030"],
  cardType: "action",
  name: "Part of Your World",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "001",
  cardNumber: 30,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_df53bbf046f542d19202f4e11bbe9d5b",
    tcgPlayer: 493481,
  },
  text: "Return a character card from your discard to your hand.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        cardType: "character",
        target: "CONTROLLER",
        type: "return-from-discard",
        destination: "hand",
      },
    },
  ],
  i18n: partOfYourWorldI18n,
};
