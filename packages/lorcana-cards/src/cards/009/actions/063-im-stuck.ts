import type { ActionCard } from "@tcg/lorcana-types";

export const imStuck: ActionCard = {
  id: "1bx",
  cardType: "action",
  name: "I'm Stuck!",
  inkType: ["amethyst"],
  franchise: "Winnie the Pooh",
  set: "009",
  text: "Chosen exerted character can't ready at the start of their next turn.",
  cost: 1,
  cardNumber: 63,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "acc10f3d5e369e92d864fbc4fc5b78c3b73e21bc",
  },
  abilities: [
    {
      id: "1bx-1",
      type: "action",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
        duration: "until-start-of-next-turn",
      },
      text: "Chosen exerted character can't ready at the start of their next turn.",
    },
  ],
};
