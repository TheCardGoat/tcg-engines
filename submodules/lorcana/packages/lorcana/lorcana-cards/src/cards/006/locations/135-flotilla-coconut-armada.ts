import type { LocationCard } from "@tcg/lorcana-types";
import { flotillaCoconutArmadaI18n } from "./135-flotilla-coconut-armada.i18n";

export const flotillaCoconutArmada: LocationCard = {
  id: "Xlq",
  canonicalId: "ci_Xlq",
  reprints: ["set6-135"],
  cardType: "location",
  name: "Flotilla",
  version: "Coconut Armada",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "006",
  cardNumber: 135,
  rarity: "rare",
  cost: 2,
  willpower: 6,
  moveCost: 2,
  lore: 0,
  inkable: false,
  externalIds: {
    lorcast: "crd_5b57ee130c204b778df487c9826834c1",
    tcgPlayer: 588367,
  },
  text: [
    {
      title: "TINY THIEVES",
      description:
        "At the start of your turn, if you have a character here, all opponents lose 1 lore and you gain lore equal to the lore lost this way.",
    },
  ],
  abilities: [
    {
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "same-location-as-source",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        steps: [
          {
            amount: 1,
            target: "EACH_OPPONENT",
            type: "lose-lore",
          },
          {
            amount: {
              type: "lore-lost",
            },
            target: "CONTROLLER",
            type: "gain-lore",
          },
        ],
        type: "sequence",
      },
      id: "1vh-1",
      name: "TINY THIEVES",
      text: "TINY THIEVES At the start of your turn, if you have a character here, all opponents lose 1 lore and you gain lore equal to the lore lost this way.",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      type: "triggered",
    },
  ],
  i18n: flotillaCoconutArmadaI18n,
};
