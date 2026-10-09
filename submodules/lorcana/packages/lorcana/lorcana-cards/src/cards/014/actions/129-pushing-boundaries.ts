import type { ActionCard } from "@tcg/lorcana-types";
import { pushingBoundariesI18n } from "./129-pushing-boundaries.i18n";

export const pushingBoundaries: ActionCard = {
  id: "Tuy",
  canonicalId: "ci_Tuy",
  slug: "lorcana-ci_Tuy",
  printings: [
    {
      id: "set14-129",
      artId: "set14-129",
      setCode: "set14",
      collectorNumber: "129",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-129"],
  cardType: "action",
  name: "Pushing Boundaries",
  inkType: ["ruby"],
  franchise: "Big Hero 6",
  set: "014",
  cardNumber: 129,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_b4b46cfa078f4621ad23699e96e28b4f",
  },
  text: "Chosen character of yours takes no damage while challenging this turn. Get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
  abilities: [
    {
      type: "action",
      text: "Chosen character of yours takes no damage while challenging this turn. Get 1 ink drop. (You may remove an ink drop to pay 1 {I}.)",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "grant-ability",
            ability: {
              type: "takes-no-damage-while-challenging",
              text: "Takes no damage while challenging this turn.",
            },
            duration: "this-turn",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "gain-ink-drop",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: pushingBoundariesI18n,
};
