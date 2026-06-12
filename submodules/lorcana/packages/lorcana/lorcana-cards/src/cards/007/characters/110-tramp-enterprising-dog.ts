import type { CharacterCard } from "@tcg/lorcana-types";
import { trampEnterprisingDogI18n } from "./110-tramp-enterprising-dog.i18n";

export const trampEnterprisingDog: CharacterCard = {
  id: "XWF",
  canonicalId: "ci_DSV",
  reprints: ["set7-110"],
  cardType: "character",
  name: "Tramp",
  version: "Enterprising Dog",
  inkType: ["emerald"],
  franchise: "Lady and the Tramp",
  set: "007",
  cardNumber: 110,
  rarity: "rare",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_07d1ea2923ad44b9b2dddf78993e103b",
    tcgPlayer: 619740,
  },
  text: [
    {
      title: "HEY, PIDGE",
      description:
        "If you have a character named Lady in play, you pay 1 {I} less to play this character.",
    },
    {
      title: "NO TIME FOR WISECRACKS",
      description:
        "When you play this character, chosen character of yours gets +1 {S} this turn for each other character you have in play.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "dfs-1",
      name: "HEY, PIDGE",
      type: "static",
      sourceZones: ["hand"],
      condition: {
        type: "has-named-character",
        name: "Lady",
        controller: "you",
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
      },
      text: "HEY, PIDGE If you have a character named Lady in play, you pay 1 {I} less to play this character.",
    },
    {
      effect: {
        duration: "this-turn",
        modifier: {
          type: "filtered-count",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          excludeSelf: true,
          filters: [],
        },
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "you",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      id: "dfs-2",
      name: "NO TIME FOR WISECRACKS",
      text: "NO TIME FOR WISECRACKS When you play this character, chosen character of yours gets +1 {S} this turn for each other character you have in play.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: trampEnterprisingDogI18n,
};
