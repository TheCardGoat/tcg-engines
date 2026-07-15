import type { ActionCard } from "@tcg/lorcana-types";
import { goTheDistanceI18n } from "./129-go-the-distance.i18n";

export const goTheDistance: ActionCard = {
  id: "lwc",
  canonicalId: "ci_lwc",
  slug: "lorcana-ci_lwc",
  printings: [
    {
      id: "set2-129",
      artId: "set2-129",
      setCode: "set2",
      collectorNumber: "129",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set2-129"],
  cardType: "action",
  name: "Go the Distance",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "002",
  cardNumber: 129,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_2d25ebdcc8874b25b749753468ba5956",
    tcgPlayer: "527242",
  },
  text: "Ready chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            target: "YOUR_CHOSEN_DAMAGED_CHARACTER",
            type: "ready",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: {
              ref: "previous-target",
            },
            type: "restriction",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
      },
    },
  ],
  i18n: goTheDistanceI18n,
};
