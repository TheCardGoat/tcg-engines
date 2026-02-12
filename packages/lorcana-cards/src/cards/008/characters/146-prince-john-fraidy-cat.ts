import type { CharacterCard } from "@tcg/lorcana-types";

export const princeJohnFraidycat: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "self",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "fa9-1",
      name: "HELP! HELP!",
      text: "HELP! HELP! Whenever an opponent plays a character, deal 1 damage to this character.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "opponent",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 146,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Prince"],
  cost: 3,
  externalIds: {
    ravensburger: "3716bbbbc0261b3fecc0b6ae8298ef4193facf52",
  },
  franchise: "Robin Hood",
  fullName: "Prince John - Fraidy-Cat",
  id: "fa9",
  inkType: ["ruby"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Prince John",
  set: "008",
  strength: 5,
  text: "HELP! HELP! Whenever an opponent plays a character, deal 1 damage to this character.",
  version: "Fraidy-Cat",
  willpower: 5,
};
