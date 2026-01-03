import type { ActionCard } from "@tcg/lorcana-types";

export const PartOfYourWorldUndefined: ActionCard = {
  id: "ztz",
  cardType: "action",
  name: "Part of Your World",
  version: "undefined",
  fullName: "Part of Your World - undefined",
  inkType: ["amber"],
  franchise: "Disney",
  set: "001",
  text: "_(A character with cost 3 or more can {E} to sing this song\rfor free.)_\n Return a character card from your discard to your hand.",
  cost: 3,
  actionSubtype: "song",
  cardNumber: 30,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "_(A character with cost 3 or more can {E} to sing this song\rfor free.)_\n Return a character card from your discard to your hand.",
      id: "ztz-1",
      effect: {
        type: "return-from-discard",
        target: "CONTROLLER",
        cardType: "character",
      },
    },
  ],
};
