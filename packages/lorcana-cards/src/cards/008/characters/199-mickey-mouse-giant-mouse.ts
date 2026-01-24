import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseGiantMouse: CharacterCard = {
  id: "17p",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Giant Mouse",
  fullName: "Mickey Mouse - Giant Mouse",
  inkType: ["steel"],
  set: "008",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nTHE BIGGEST STAR EVER When this character is banished, deal 5 damage to each opposing character.",
  cost: 10,
  strength: 10,
  willpower: 10,
  lore: 5,
  cardNumber: 199,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "9d90f566a3400873ee6d58692fa1bec880d0b149",
  },
  abilities: [
    {
      id: "17p-1",
      type: "keyword",
      keyword: "Bodyguard",
      text: "Bodyguard",
    },
    {
      id: "17p-2",
      type: "triggered",
      name: "THE BIGGEST STAR EVER",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "deal-damage",
        amount: 5,
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "THE BIGGEST STAR EVER When this character is banished, deal 5 damage to each opposing character.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
