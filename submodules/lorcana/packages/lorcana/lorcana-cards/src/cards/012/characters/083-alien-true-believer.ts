import type { CharacterCard } from "@tcg/lorcana-types";
import { alienTrueBelieverI18n } from "./083-alien-true-believer.i18n";

export const alienTrueBeliever: CharacterCard = {
  id: "m43",
  canonicalId: "ci_m43",
  reprints: ["set12-083"],
  cardType: "character",
  name: "Alien",
  version: "True Believer",
  inkType: ["emerald"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 83,
  rarity: "rare",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c671f23fc8e74ee3a7925ad650577008",
  },
  text: [
    {
      title: "WE ARE ONE",
      description: "This character gets +1 {S} for each other Toy character you have in play.",
    },
    {
      title: "HE HAS BEEN CHOSEN",
      description:
        "During your turn, when this character is banished, return another character card named Alien from your discard to your hand.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Alien", "Toy"],
  abilities: [
    {
      id: "m43-1",
      name: "WE ARE ONE",
      type: "static",
      text: "WE ARE ONE This character gets +1 {S} for each other Toy character you have in play.",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: {
          type: "filtered-count",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "has-classification",
              classification: "Toy",
            },
          ],
          excludeSelf: true,
          multiplier: 1,
        },
        target: "SELF",
      },
    },
    {
      id: "m43-2",
      name: "HE HAS BEEN CHOSEN",
      type: "triggered",
      text: "HE HAS BEEN CHOSEN During your turn, when this character is banished, return another character card named Alien from your discard to your hand.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "return-from-discard",
        cardType: "character",
        cardName: "Alien",
        destination: "hand",
        target: "CONTROLLER",
        filter: { type: "source", ref: "other" },
      },
    },
  ],
  i18n: alienTrueBelieverI18n,
};
