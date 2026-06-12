import type { ActionCard } from "@tcg/lorcana-types";
import { letsGetDangerousI18n } from "./198-lets-get-dangerous.i18n";

export const letsGetDangerous: ActionCard = {
  id: "PQZ",
  canonicalId: "ci_iht",
  reprints: ["set11-198"],
  cardType: "action",
  name: "Let's Get Dangerous",
  inkType: ["steel"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 198,
  rarity: "rare",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_656cd1bfb0084f92bfd003ca69b3b3c9",
    tcgPlayer: 677171,
  },
  text: "Each player shuffles their deck and then reveals the top card. Each player who reveals a character card may play that character for free. Otherwise, put the revealed cards on the bottom of their player's deck.",
  actionSubtype: "song",
  abilities: [
    {
      id: "w7s-1",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "shuffle-into-deck",
            target: "EACH_PLAYER",
          },
          {
            type: "scry",
            amount: 1,
            target: "CONTROLLER",
            chooser: "CONTROLLER",
            revealAll: true,
            destinations: [
              {
                zone: "play",
                min: 0,
                max: 1,
                cost: "free",
                filter: { type: "card-type", cardType: "character" },
              },
              {
                zone: "deck-bottom",
                remainder: true,
              },
            ],
          },
          {
            type: "scry",
            amount: 1,
            target: "OPPONENT",
            chooser: "OPPONENT",
            revealAll: true,
            destinations: [
              {
                zone: "play",
                min: 0,
                max: 1,
                cost: "free",
                filter: { type: "card-type", cardType: "character" },
              },
              {
                zone: "deck-bottom",
                remainder: true,
              },
            ],
          },
        ],
      },
      type: "action",
      text: "Each player shuffles their deck and then reveals the top card. Each player who reveals a character card may play that character for free. Otherwise, put the revealed cards on the bottom of their player’s deck.",
    },
  ],
  i18n: letsGetDangerousI18n,
};
