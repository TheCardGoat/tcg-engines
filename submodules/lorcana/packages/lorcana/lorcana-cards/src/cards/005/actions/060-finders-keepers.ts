import type { ActionCard } from "@tcg/lorcana-types";
import { findersKeepersI18n } from "./060-finders-keepers.i18n";

export const findersKeepers: ActionCard = {
  id: "J7L",
  canonicalId: "ci_LfA",
  reprints: ["set5-060"],
  cardType: "action",
  name: "Finders Keepers",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "005",
  cardNumber: 60,
  rarity: "uncommon",
  cost: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_c2ea432892434d9c9814d4bf6c3791a5",
    tcgPlayer: 561997,
  },
  text: "Draw 3 cards.",
  abilities: [
    {
      id: "q4f-1",
      effect: {
        amount: 3,
        target: "CONTROLLER",
        type: "draw",
      },
      type: "action",
      text: "Draw 3 cards.",
    },
  ],
  i18n: findersKeepersI18n,
};
