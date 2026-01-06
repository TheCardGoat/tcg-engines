import type { ActionCard } from "@tcg/lorcana-types/cards/card-types";

export const partOfYourWorld: ActionCard = {
  id: "ztz",
  cardType: "action",
  name: "Part of Your World",
  version: "",
  fullName: "Part of Your World",
  inkType: [
    "amber",
  ],
  franchise: "General",
  set: "001",
  text: "_(A character with cost 3 or more can {E} to sing this songfor free.)_
 Return a character card from your discard to your hand.",
  cost: 3,
  cardNumber: 30,
  rarity: "rare",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 493481,
  },
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
          type: "return-to-hand",
          target: "CHOSEN_CHARACTER",
        },
      id: "ztz-1",
      text: "Return a character card from your discard to your hand.",
    },
  ],
};
