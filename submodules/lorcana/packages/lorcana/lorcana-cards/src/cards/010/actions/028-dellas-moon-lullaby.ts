import type { ActionCard } from "@tcg/lorcana-types";
import { dellasMoonLullabyI18n } from "./028-dellas-moon-lullaby.i18n";

export const dellasMoonLullaby: ActionCard = {
  id: "VOg",
  canonicalId: "ci_VOg",
  reprints: ["set10-028"],
  cardType: "action",
  name: "Della's Moon Lullaby",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 28,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_ebc01607e02e4421b658f6fbe90a97ca",
    tcgPlayer: 658444,
  },
  text: "Chosen opposing character gets -2 {S} until the start of your next turn. Draw a card.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        steps: [
          {
            duration: "until-start-of-next-turn",
            modifier: -2,
            stat: "strength",
            target: "CHOSEN_OPPOSING_CHARACTER",
            type: "modify-stat",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      type: "action",
    },
  ],
  i18n: dellasMoonLullabyI18n,
};
