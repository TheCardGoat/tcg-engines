import type { ActionCard } from "@tcg/lorcana-types";
import { ursulasPlanI18n } from "./063-ursulas-plan.i18n";

export const ursulasPlan: ActionCard = {
  id: "SrO",
  canonicalId: "ci_SrO",
  reprints: ["set4-063"],
  cardType: "action",
  name: "Ursula’s Plan",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 63,
  rarity: "uncommon",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_d06befe89918438384a8d38e7acea2bd",
    tcgPlayer: 550572,
  },
  text: "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.",
  abilities: [
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "exert",
            chosenBy: "opponent",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            duration: "until-start-of-next-turn",
            restriction: "cant-ready",
            target: {
              ref: "previous-target",
            },
            type: "restriction",
          },
        ],
      },
      id: "ygy-1",
      text: "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.",
      type: "action",
    },
  ],
  i18n: ursulasPlanI18n,
};
