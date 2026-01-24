import type { CharacterCard } from "@tcg/lorcana-types";

export const heiheiNotsotrickyChicken: CharacterCard = {
  id: "1qk",
  cardType: "character",
  name: "Heihei",
  version: "Not-So-Tricky Chicken",
  fullName: "Heihei - Not-So-Tricky Chicken",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "006",
  text: "EAT ANYTHING When you play this character, exert chosen opposing item. It can't ready at the start of its next turn.\nOUT TO LUNCH During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 146,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e186a298a86ce8b53f95cb5e43b6764d06b482e9",
  },
  abilities: [
    {
      id: "1qk-1",
      type: "triggered",
      name: "EAT ANYTHING",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "exert",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["item"],
            },
          },
          {
            type: "restriction",
            restriction: "cant-ready",
            target: "SELF",
            duration: "next-turn",
          },
        ],
      },
      text: "EAT ANYTHING When you play this character, exert chosen opposing item. It can't ready at the start of its next turn.",
    },
    {
      id: "1qk-2",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      text: "OUT TO LUNCH During your turn, this character gains Evasive.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
