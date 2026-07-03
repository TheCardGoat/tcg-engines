import type { ActionCard } from "@tcg/lorcana-types";
import { letsGetDangerousEnchantedI18n } from "./240-lets-get-dangerous-enchanted.i18n";

export const letsGetDangerousEnchanted: ActionCard = {
  id: "6Id",
  canonicalId: "ci_iht",
  slug: "lorcana-ci_iht",
  printings: [
    {
      id: "set11-240-enchanted",
      artId: "ci_iht-enchanted",
      setCode: "set11",
      collectorNumber: "240",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set11-198"],
  cardType: "action",
  name: "Let's Get Dangerous",
  inkType: ["steel"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 240,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_656cd1bfb0084f92bfd003ca69b3b3c9",
    tcgPlayer: "677171",
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
                filter: {
                  type: "card-type",
                  cardType: "character",
                },
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
                filter: {
                  type: "card-type",
                  cardType: "character",
                },
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
  i18n: letsGetDangerousEnchantedI18n,
};
