import type { ActionCard } from "@tcg/lorcana-types";

export const bibbidiBobbidiBoo: ActionCard = {
  id: "1iv",
  cardType: "action",
  name: "Bibbidi Bobbidi Boo",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "002",
  text: "Return chosen character of yours to your hand to play another character with the same cost or less for free.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 96,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "c33bda0d2ff8094f6f5f122d84611a6eb2793226",
  },
  abilities: [
    {
      id: "1iv-1",
      type: "action",
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Return chosen character of yours to your hand to play another character with the same cost or less for free.",
    },
  ],
};
