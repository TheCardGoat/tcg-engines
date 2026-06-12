import type { LocationCard } from "@tcg/lorcana-types";
import { darkwingTowerIcyHeadquartersI18n } from "./204-darkwing-tower-icy-headquarters.i18n";

export const darkwingTowerIcyHeadquarters: LocationCard = {
  id: "Rs3",
  canonicalId: "ci_Rs3",
  reprints: ["set11-204"],
  cardType: "location",
  name: "Darkwing Tower",
  version: "Icy Headquarters",
  inkType: ["steel"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 204,
  rarity: "uncommon",
  cost: 4,
  willpower: 8,
  moveCost: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_22e1f1dc8f434e0a87d5335d7a6b2984",
    tcgPlayer: 676252,
  },
  text: [
    {
      title: "EVIL VANQUISHED",
      description:
        "During your turn, whenever an opposing Villain character is banished, you may ready a character here. If you do, they can't quest for the rest of this turn.",
    },
  ],
  abilities: [
    {
      id: "1bz-1",
      effect: {
        chooser: "CONTROLLER",
        type: "optional",
        effect: {
          type: "sequence",
          steps: [
            {
              target: {
                cardTypes: ["character"],
                count: 1,
                owner: "you",
                selector: "chosen",
                zones: ["play"],
                filter: [
                  {
                    type: "same-location-as-source",
                  },
                ],
              },
              type: "ready",
            },
            {
              restriction: "cant-quest",
              target: {
                ref: "previous-target",
              },
              type: "restriction",
              duration: "this-turn",
            },
          ],
        },
      },
      name: "EVIL VANQUISHED",
      trigger: {
        event: "banish",
        on: {
          cardType: "character",
          controller: "opponent",
          classification: "Villain",
        },
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
      text: "EVIL VANQUISHED During your turn, whenever an opposing Villain character is banished, you may ready a character here. If you do, they can't quest for the rest of this turn.",
    },
  ],
  i18n: darkwingTowerIcyHeadquartersI18n,
};
