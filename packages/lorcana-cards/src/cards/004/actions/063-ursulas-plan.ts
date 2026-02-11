import type { ActionCard } from "@tcg/lorcana-types";

export const ursulasPlan: ActionCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
        duration: "until-start-of-next-turn",
      },
      id: "ygy-1",
      text: "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.",
      type: "action",
    },
  ],
  cardNumber: 63,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "7c3ca633992bcba20ad4ad0c349c0e74c1e3f529",
  },
  franchise: "Little Mermaid",
  id: "ygy",
  inkType: ["amethyst"],
  inkable: false,
  missingTests: true,
  name: "Ursula’s Plan",
  set: "004",
  text: "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.",
};
