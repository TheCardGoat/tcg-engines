import type { ActionCard } from "@tcg/lorcana-types";
import { fantasticalAndMagicalI18n } from "./079-fantastical-and-magical.i18n";

export const fantasticalAndMagical: ActionCard = {
  id: "XxM",
  canonicalId: "ci_ABM",
  reprints: ["set8-079"],
  cardType: "action",
  name: "Fantastical and Magical",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "008",
  cardNumber: 79,
  rarity: "rare",
  cost: 9,
  inkable: false,
  externalIds: {
    lorcast: "crd_a728498e9f554bb2b5e4fd82595ed11e",
    tcgPlayer: 631975,
  },
  text: [
    {
      title: "Sing Together 9",
      description:
        "(Any number of your or your teammates' characters with total cost 9 or more may {E} to sing this song for free.)",
    },
    {
      title: "For each character that sang this song, draw a card and gain 1 lore.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Sing Together 9 For each character that sang this song, draw a card and gain 1 lore.",
      effect: {
        type: "for-each",
        counter: {
          thisTurn: true,
          type: "characters-that-sang",
        },
        effect: {
          type: "sequence",
          steps: [
            {
              amount: 1,
              target: "CONTROLLER",
              type: "draw",
            },
            {
              amount: 1,
              target: "CONTROLLER",
              type: "gain-lore",
            },
          ],
        },
      },
      id: "XxM-1",
    },
  ],
  i18n: fantasticalAndMagicalI18n,
};
