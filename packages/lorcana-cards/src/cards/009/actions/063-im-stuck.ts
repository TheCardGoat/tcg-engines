import type { ActionCard } from "@tcg/lorcana-types";

export const imStuck: ActionCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
        duration: "until-start-of-next-turn",
      },
      id: "1bx-1",
      text: "Chosen exerted character can't ready at the start of their next turn.",
      type: "action",
    },
  ],
  cardNumber: 63,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "acc10f3d5e369e92d864fbc4fc5b78c3b73e21bc",
  },
  franchise: "Winnie the Pooh",
  id: "1bx",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "I'm Stuck!",
  set: "009",
  text: "Chosen exerted character can't ready at the start of their next turn.",
};
