import type { LocationCard } from "@tcg/lorcana-types";
import { theGreatIlluminaryAbandonedLaboratoryI18n } from "./068-the-great-illuminary-abandoned-laboratory.i18n";

export const theGreatIlluminaryAbandonedLaboratory: LocationCard = {
  id: "CGw",
  canonicalId: "ci_CGw",
  reprints: ["set10-068"],
  cardType: "location",
  name: "The Great Illuminary",
  version: "Abandoned Laboratory",
  inkType: ["amethyst"],
  franchise: "Lorcana",
  set: "010",
  cardNumber: 68,
  rarity: "uncommon",
  cost: 2,
  willpower: 3,
  moveCost: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f0a21489090449a4af62aa6f09ad9552",
    tcgPlayer: 658467,
  },
  text: [
    {
      title: "STARTLING DISCOVERY",
      description: 'Characters gain " {E} — Draw a card" while here.',
    },
  ],
  abilities: [
    {
      id: "9qd-1",
      name: "STARTLING DISCOVERY",
      text: 'STARTLING DISCOVERY Characters gain "{E} — Draw a card" while here.',
      type: "static",
      effect: {
        type: "grant-abilities-while-here",
        target: "CHARACTERS_HERE",
        abilities: [
          {
            id: "9qd-1a",
            name: "STARTLING DISCOVERY",
            text: "{E} — Draw a card.",
            type: "activated",
            cost: {
              exert: true,
            },
            effect: {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
          },
        ],
      },
    },
  ],
  i18n: theGreatIlluminaryAbandonedLaboratoryI18n,
};
