import type { CharacterCard } from "@tcg/lorcana-types";

export const trampEnterprisingDog: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character named Lady in play",
        },
        then: {
          type: "play-card",
          from: "hand",
        },
      },
      id: "dfs-1",
      text: "HEY, PIDGE If you have a character named Lady in play, you pay 1 {I} less to play this character.",
      type: "action",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      id: "dfs-2",
      name: "NO TIME FOR WISECRACKS",
      text: "NO TIME FOR WISECRACKS When you play this character, chosen character of yours gets +1 {S} this turn for each other character you have in play.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 110,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "306f19dbca99cea365477d3efb8420831ab5d23c",
  },
  franchise: "Lady and the Tramp",
  fullName: "Tramp - Enterprising Dog",
  id: "dfs",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Tramp",
  set: "007",
  strength: 1,
  text: "HEY, PIDGE If you have a character named Lady in play, you pay 1 {I} less to play this character.\nNO TIME FOR WISECRACKS When you play this character, chosen character of yours gets +1 {S} this turn for each other character you have in play.",
  version: "Enterprising Dog",
  willpower: 3,
};
