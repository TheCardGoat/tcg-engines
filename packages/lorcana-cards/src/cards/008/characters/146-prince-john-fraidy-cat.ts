import type { CharacterCard } from "@tcg/lorcana-types";

export const princeJohnFraidycat: CharacterCard = {
  id: "fa9",
  cardType: "character",
  name: "Prince John",
  version: "Fraidy-Cat",
  fullName: "Prince John - Fraidy-Cat",
  inkType: ["ruby"],
  franchise: "Robin Hood",
  set: "008",
  text: "HELP! HELP! Whenever an opponent plays a character, deal 1 damage to this character.",
  cost: 3,
  strength: 5,
  willpower: 5,
  lore: 1,
  cardNumber: 146,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "3716bbbbc0261b3fecc0b6ae8298ef4193facf52",
  },
  abilities: [
    {
      id: "fa9-1",
      type: "triggered",
      name: "HELP! HELP!",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "opponent",
          cardType: "character",
        },
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: {
          selector: "self",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "HELP! HELP! Whenever an opponent plays a character, deal 1 damage to this character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Prince"],
};
