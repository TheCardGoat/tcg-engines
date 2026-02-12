import type { ActionCard } from "@tcg/lorcana-types";

export const bibbidiBobbidiBoo: ActionCard = {
  abilities: [
    {
      effect: {
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "return-to-hand",
      },
      id: "1iv-1",
      text: "Return chosen character of yours to your hand to play another character with the same cost or less for free.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 96,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "c33bda0d2ff8094f6f5f122d84611a6eb2793226",
  },
  franchise: "Cinderella",
  id: "1iv",
  inkType: ["emerald"],
  inkable: false,
  missingTests: true,
  name: "Bibbidi Bobbidi Boo",
  set: "002",
  text: "Return chosen character of yours to your hand to play another character with the same cost or less for free.",
};
