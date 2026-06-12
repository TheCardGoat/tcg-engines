import type { ActionCard } from "@tcg/lorcana-types";
import { henWensVisionsI18n } from "./161-hen-wens-visions.i18n";

export const henWensVisions: ActionCard = {
  id: "337",
  canonicalId: "ci_337",
  reprints: ["set10-161"],
  cardType: "action",
  name: "Hen Wen's Visions",
  inkType: ["sapphire"],
  franchise: "Black Cauldron",
  set: "010",
  cardNumber: 161,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e118a4c9805c426687bc202180e54e46",
    tcgPlayer: 657891,
  },
  text: "Look at the top 4 cards of your deck. Put 1 on the top of your deck and the rest on the bottom in any order.",
  abilities: [
    {
      effect: {
        amount: 4,
        destinations: [
          {
            max: 1,
            min: 1,
            ordering: "player-choice",
            zone: "deck-top",
          },
          {
            ordering: "player-choice",
            remainder: true,
            zone: "deck-bottom",
          },
        ],
        target: "CONTROLLER",
        type: "scry",
      },
      type: "action",
    },
  ],
  i18n: henWensVisionsI18n,
};
