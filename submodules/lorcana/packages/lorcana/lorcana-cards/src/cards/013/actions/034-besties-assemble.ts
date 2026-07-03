import type { ActionCard } from "@tcg/lorcana-types";
import { bestiesAssembleI18n } from "./034-besties-assemble.i18n";

export const bestiesAssemble: ActionCard = {
  id: "0fd",
  canonicalId: "ci_0fd",
  slug: "lorcana-ci_0fd",
  printings: [
    {
      id: "set13-034",
      artId: "set13-034",
      setCode: "set13",
      collectorNumber: "34",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-034"],
  cardType: "action",
  name: "Besties, Assemble!",
  inkType: ["amber"],
  franchise: "Turning Red",
  set: "013",
  cardNumber: 34,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d4497d30198144bd817e8dc4a8250c19",
  },
  text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  abilities: [
    {
      type: "action",
      text: "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      effect: {
        type: "scry",
        amount: 4,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            reveal: true,
            filter: {
              type: "card-type",
              cardType: "character",
            },
          },
          {
            zone: "deck-bottom",
            remainder: true,
            ordering: "player-choice",
          },
        ],
      },
    },
  ],
  i18n: bestiesAssembleI18n,
};
