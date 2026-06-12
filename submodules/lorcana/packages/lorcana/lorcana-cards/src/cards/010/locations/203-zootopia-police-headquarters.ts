import type { LocationCard } from "@tcg/lorcana-types";
import { zootopiaPoliceHeadquartersI18n } from "./203-zootopia-police-headquarters.i18n";

export const zootopiaPoliceHeadquarters: LocationCard = {
  id: "hOa",
  canonicalId: "ci_hOa",
  reprints: ["set10-203"],
  cardType: "location",
  name: "Zootopia",
  version: "Police Headquarters",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "010",
  cardNumber: 203,
  rarity: "uncommon",
  cost: 1,
  willpower: 4,
  moveCost: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e86d177fb9f24d4683e8f639595038d1",
    tcgPlayer: 659415,
  },
  text: [
    {
      title: "NEW INFORMATION",
      description:
        "Once during your turn, whenever you move a character here, you may draw a card, then choose and discard a card.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            {
              amount: 1,
              chosen: true,
              from: "hand",
              target: "CONTROLLER",
              type: "discard",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      id: "98y-1",
      name: "NEW INFORMATION",
      text: "NEW INFORMATION Once during your turn, whenever you move a character here, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "move",
        on: "CHARACTERS_HERE",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "first-time-each-turn",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: zootopiaPoliceHeadquartersI18n,
};
