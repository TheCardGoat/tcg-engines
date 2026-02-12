import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseGiantMouse: CharacterCard = {
  abilities: [
    {
      id: "17p-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      effect: {
        amount: 5,
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "opponent",
          selector: "all",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "17p-2",
      name: "THE BIGGEST STAR EVER",
      text: "THE BIGGEST STAR EVER When this character is banished, deal 5 damage to each opposing character.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 199,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 10,
  externalIds: {
    ravensburger: "9d90f566a3400873ee6d58692fa1bec880d0b149",
  },
  fullName: "Mickey Mouse - Giant Mouse",
  id: "17p",
  inkType: ["steel"],
  inkable: false,
  lore: 5,
  missingTests: true,
  name: "Mickey Mouse",
  set: "008",
  strength: 10,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nTHE BIGGEST STAR EVER When this character is banished, deal 5 damage to each opposing character.",
  version: "Giant Mouse",
  willpower: 10,
};
