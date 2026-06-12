import type { ActionCard } from "@tcg/lorcana-types";
import { forestDuelI18n } from "./077-forest-duel.i18n";

export const forestDuel: ActionCard = {
  id: "zpF",
  canonicalId: "ci_zpF",
  reprints: ["set8-077"],
  cardType: "action",
  name: "Forest Duel",
  inkType: ["amethyst"],
  franchise: "Bambi",
  set: "008",
  cardNumber: 77,
  rarity: "uncommon",
  cost: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_79eeecfdd20849aaade7d29646fed146",
    tcgPlayer: 631343,
  },
  text: 'Your characters gain Challenger +2 and "When this character is banished in a challenge, return this card to your hand" this turn. (They get +2 {S} while challenging.)',
  abilities: [
    {
      effect: {
        steps: [
          {
            duration: "this-turn",
            keyword: "Challenger",
            target: "YOUR_CHARACTERS",
            type: "gain-keyword",
            value: 2,
          },
          {
            type: "grant-ability",
            ability: "return-to-hand-when-banished",
            duration: "this-turn",
            target: "YOUR_CHARACTERS",
          },
        ],
        type: "sequence",
      },
      id: "12g-1",
      text: 'Your characters gain Challenger +2 and "When this character is banished in a challenge, return this card to your hand" this turn.',
      type: "action",
    },
  ],
  i18n: forestDuelI18n,
};
