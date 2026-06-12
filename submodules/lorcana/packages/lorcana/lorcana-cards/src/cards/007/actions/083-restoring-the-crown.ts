import type { ActionCard } from "@tcg/lorcana-types";
import { restoringTheCrownI18n } from "./083-restoring-the-crown.i18n";

export const restoringTheCrown: ActionCard = {
  id: "X4B",
  canonicalId: "ci_X4B",
  reprints: ["set7-083"],
  cardType: "action",
  name: "Restoring the Crown",
  inkType: ["amethyst", "steel"],
  franchise: "Aladdin",
  set: "007",
  cardNumber: 83,
  rarity: "rare",
  cost: 6,
  inkable: false,
  externalIds: {
    lorcast: "crd_73e72e4fa154400f892e295a0eaffb40",
    tcgPlayer: 619450,
  },
  text: "Exert all opposing characters. Whenever one of your characters banishes another character in a challenge this turn, gain 2 lore.",
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              selector: "all",
              count: "all",
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "exert",
          },
          {
            type: "create-triggered-ability",
            lifecycle: {
              kind: "floating",
              duration: "this-turn",
            },
            ability: {
              trigger: {
                event: "banish-in-challenge",
                on: "YOUR_CHARACTERS",
                timing: "whenever",
              },
              effect: {
                amount: 2,
                target: "CONTROLLER",
                type: "gain-lore",
              },
            },
          },
        ],
        type: "sequence",
      },
      id: "1ss-1",
      text: "Exert all opposing characters. Whenever one of your characters banishes another character in a challenge this turn, gain 2 lore.",
      type: "action",
    },
  ],
  i18n: restoringTheCrownI18n,
};
