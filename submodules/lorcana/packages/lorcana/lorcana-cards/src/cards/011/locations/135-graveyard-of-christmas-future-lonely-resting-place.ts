import type { LocationCard } from "@tcg/lorcana-types";
import { graveyardOfChristmasFutureLonelyRestingPlaceI18n } from "./135-graveyard-of-christmas-future-lonely-resting-place.i18n";

export const graveyardOfChristmasFutureLonelyRestingPlace: LocationCard = {
  id: "gta",
  canonicalId: "ci_gta",
  reprints: ["set11-135"],
  cardType: "location",
  name: "Graveyard of Christmas Future",
  version: "Lonely Resting Place",
  inkType: ["ruby"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 135,
  rarity: "rare",
  cost: 4,
  willpower: 8,
  moveCost: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_648f06059c3b4f8680bc932c085d6182",
    tcgPlayer: 672432,
  },
  text: [
    {
      title: "NEW ARRIVAL",
      description:
        "Whenever you move a character here, put the top card of your deck under this location facedown.",
    },
    {
      title: "ANOTHER CHANCE",
      description:
        "At the start of your turn, you may put all cards from under this location into your hand. If you do, banish this location.",
    },
  ],
  abilities: [
    {
      id: "aa3-1",
      name: "NEW ARRIVAL",
      trigger: {
        event: "move",
        on: "CHARACTERS_HERE",
        timing: "whenever",
      },
      effect: {
        type: "put-under",
        source: "top-of-deck",
        under: "self",
      },
      text: "NEW ARRIVAL Whenever you move a character here, put the top card of your deck under this location facedown.",
      type: "triggered",
    },
    {
      id: "aa3-2",
      name: "ANOTHER CHANCE",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        chooser: "CONTROLLER",
        type: "optional",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-cards-from-under",
              target: {
                ref: "self",
              },
              source: "target",
              destination: "hand",
            },
            {
              type: "banish",
              target: {
                ref: "self",
              },
            },
          ],
        },
      },
      text: "ANOTHER CHANCE At the start of your turn, you may put all cards from under this location into your hand. If you do, banish this location.",
      type: "triggered",
    },
  ],
  i18n: graveyardOfChristmasFutureLonelyRestingPlaceI18n,
};
