import type { ActionCard } from "@tcg/lorcana-types";
import { visitingChristmasPastI18n } from "./162-visiting-christmas-past.i18n";

export const visitingChristmasPast: ActionCard = {
  id: "RW2",
  canonicalId: "ci_RW2",
  reprints: ["set11-162"],
  cardType: "action",
  name: "Visiting Christmas Past",
  inkType: ["sapphire"],
  franchise: "Mickey's Christmas Carol",
  set: "011",
  cardNumber: 162,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_8c8dd7b9235e4b778aeff7b8b4da14ce",
    tcgPlayer: 673742,
  },
  text: "Put any number of cards from under your characters and locations into your inkwell facedown and exerted.",
  abilities: [
    {
      id: "z49-1",
      type: "action",
      text: "Put any number of cards from under your characters and locations into your inkwell facedown and exerted.",
      effect: {
        type: "move-cards-from-under",
        source: "selected",
        destination: "inkwell-facedown-exerted",
        target: {
          selector: "chosen",
          count: {
            upTo: 99,
          },
          zones: ["limbo"],
          filter: [
            {
              type: "under-parent",
              owner: "you",
              cardTypes: ["character", "location"],
            },
          ],
        },
      },
    },
  ],
  i18n: visitingChristmasPastI18n,
};
