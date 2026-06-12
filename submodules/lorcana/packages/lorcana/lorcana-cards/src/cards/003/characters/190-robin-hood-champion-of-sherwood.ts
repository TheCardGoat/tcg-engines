import type { CharacterCard } from "@tcg/lorcana-types";
import { robinHoodChampionOfSherwoodI18n } from "./190-robin-hood-champion-of-sherwood.i18n";

export const robinHoodChampionOfSherwood: CharacterCard = {
  id: "4OB",
  canonicalId: "ci_HOf",
  reprints: ["set3-190", "set9-177"],
  cardType: "character",
  name: "Robin Hood",
  version: "Champion of Sherwood",
  inkType: ["steel"],
  franchise: "Robin Hood",
  set: "003",
  cardNumber: 190,
  rarity: "legendary",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_2bf47bf7bc7f46afa6d39e40f0dc86e7",
    tcgPlayer: 650110,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "SKILLED COMBATANT",
      description:
        "During your turn, whenever this character banishes another character in a challenge, gain 2 lore.",
    },
    {
      title: "THE GOOD OF OTHERS",
      description: "When this character is banished in a challenge, you may draw a card.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "1oq-1",
      keyword: "Shift",
      text: "Shift 3 {I}",
      type: "keyword",
    },
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "1oq-2",
      name: "SKILLED COMBATANT",
      text: "SKILLED COMBATANT During your turn, whenever this character banishes another character in a challenge, gain 2 lore.",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      type: "triggered",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "1oq-3",
      name: "THE GOOD OF OTHERS",
      text: "THE GOOD OF OTHERS When this character is banished in a challenge, you may draw a card.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
        restrictions: [
          {
            type: "in-challenge",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: robinHoodChampionOfSherwoodI18n,
};
