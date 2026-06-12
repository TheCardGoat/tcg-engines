import type { ActionCard } from "@tcg/lorcana-types";
import { magicalAidI18n } from "./063-magical-aid.i18n";

export const magicalAid: ActionCard = {
  id: "ntG",
  canonicalId: "ci_ntG",
  reprints: ["set5-063"],
  cardType: "action",
  name: "Magical Aid",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "005",
  cardNumber: 63,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_6efcf80c6ccc458e9892bacc332c32d7",
    tcgPlayer: 561627,
  },
  text: 'Chosen character gains Challenger +3 and "When this character is banished in a challenge, return this card to your hand" this turn. (They get +3 {S} while challenging.)',
  abilities: [
    {
      effect: {
        steps: [
          {
            keyword: "Challenger",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "gain-keyword",
            value: 3,
            duration: "this-turn",
          },
          {
            ability: "return-to-hand-when-banished",
            duration: "this-turn",
            target: {
              ref: "previous-target",
            },
            type: "grant-ability",
          },
        ],
        type: "sequence",
      },
      id: "6tm-1",
      text: "Chosen character gains Challenger +3 and “When this character is banished in a challenge, return this card to your hand” this turn.",
      type: "action",
    },
  ],
  i18n: magicalAidI18n,
};
