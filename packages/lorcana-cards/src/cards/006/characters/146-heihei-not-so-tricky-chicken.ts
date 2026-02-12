import type { CharacterCard } from "@tcg/lorcana-types";

export const heiheiNotsotrickyChicken: CharacterCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["item"],
            },
            type: "exert",
          },
          {
            duration: "next-turn",
            restriction: "cant-ready",
            target: "SELF",
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "1qk-1",
      name: "EAT ANYTHING",
      text: "EAT ANYTHING When you play this character, exert chosen opposing item. It can't ready at the start of its next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1qk-2",
      text: "OUT TO LUNCH During your turn, this character gains Evasive.",
      type: "action",
    },
  ],
  cardNumber: 146,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "e186a298a86ce8b53f95cb5e43b6764d06b482e9",
  },
  franchise: "Moana",
  fullName: "Heihei - Not-So-Tricky Chicken",
  id: "1qk",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Heihei",
  set: "006",
  strength: 2,
  text: "EAT ANYTHING When you play this character, exert chosen opposing item. It can't ready at the start of its next turn.\nOUT TO LUNCH During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  version: "Not-So-Tricky Chicken",
  willpower: 2,
};
