import type { CharacterCard } from "@tcg/lorcana-types";
import { negaduckPublicEnemyNumberOneI18n } from "./116-negaduck-public-enemy-number-one.i18n";

export const negaduckPublicEnemyNumberOne: CharacterCard = {
  id: "iMq",
  canonicalId: "ci_bMZ",
  reprints: ["set11-116"],
  cardType: "character",
  name: "Negaduck",
  version: "Public Enemy Number One",
  inkType: ["ruby"],
  franchise: "Darkwing Duck",
  set: "011",
  cardNumber: 116,
  rarity: "rare",
  cost: 5,
  strength: 6,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_580ca4f029554dd68409aac983fdae69",
    tcgPlayer: 677164,
  },
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "STICKY FINGERS",
      description:
        "Whenever this character challenges another character, each opponent loses 1 lore and you gain 1 lore.",
    },
  ],
  classifications: ["Floodborn", "Super", "Villain"],
  abilities: [
    {
      id: "hmm-1",
      cost: {
        ink: 3,
      },
      keyword: "Shift",
      type: "keyword",
      text: "Shift 3 {I}",
    },
    {
      id: "hmm-2",
      effect: {
        steps: [
          {
            amount: 1,
            target: "EACH_OPPONENT",
            type: "lose-lore",
          },
          {
            amount: 1,
            type: "gain-lore",
          },
        ],
        type: "sequence",
      },
      name: "STICKY FINGERS",
      trigger: {
        defender: {
          controller: "opponent",
        },
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
      text: "STICKY FINGERS Whenever this character challenges another character, each opponent loses 1 lore and you gain 1 lore.",
    },
  ],
  i18n: negaduckPublicEnemyNumberOneI18n,
};
