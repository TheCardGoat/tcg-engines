import type { ActionCard } from "@tcg/lorcana";

export const showMeMore: ActionCard = {
  id: "11i",
  cardType: "action",
  name: "Show Me More!",
  fullName: "Show Me More!",
  inkType: ["amethyst"],
  franchise: "Snow White",
  set: "007",
  text: "Each player draws 3 cards.",
  cardNumber: "082",
  cost: 2,
  inkable: false,
  externalIds: {
    ravensburger: "873eefb76cf90cb4ec1223e2e0418e03236723b2",
  },
  abilities: [
    {
      id: "11i-1",
      text: "Each player draws 3 cards.",
      type: "static",
    },
  ],
};
