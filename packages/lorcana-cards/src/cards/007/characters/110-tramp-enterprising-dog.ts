import type { CharacterCard } from "@tcg/lorcana-types";

export const trampEnterprisingDog: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you have a character named Lady in play",
          type: "if",
        },
        then: {
          from: "hand",
          type: "play-card",
        },
        type: "conditional",
      },
      id: "dfs-1",
      text: "HEY, PIDGE If you have a character named Lady in play, you pay 1 {I} less to play this character.",
      type: "action",
    },
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
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
