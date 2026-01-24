import type { ActionCard } from "@tcg/lorcana-types";

export const ursulasPlan: ActionCard = {
  id: "ygy",
  cardType: "action",
  name: "Ursula’s Plan",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.",
  cost: 3,
  cardNumber: 63,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "7c3ca633992bcba20ad4ad0c349c0e74c1e3f529",
  },
  abilities: [
    {
      id: "ygy-1",
      type: "action",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
        duration: "their-next-turn",
      },
      text: "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.",
    },
  ],
};
