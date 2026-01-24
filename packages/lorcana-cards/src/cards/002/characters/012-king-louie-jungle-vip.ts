import type { CharacterCard } from "@tcg/lorcana-types";

export const kingLouieJungleVip: CharacterCard = {
  id: "3ec",
  cardType: "character",
  name: "King Louie",
  version: "Jungle VIP",
  fullName: "King Louie - Jungle VIP",
  inkType: ["amber"],
  franchise: "Jungle Book",
  set: "002",
  text: "LAY IT ON THE LINE Whenever another character is banished, you may remove up to 2 damage from this character.",
  cost: 7,
  strength: 3,
  willpower: 8,
  lore: 2,
  cardNumber: 12,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0c3fed9a867179785f504207a81666bcfe1b2abc",
  },
  abilities: [
    {
      id: "3ec-1",
      type: "triggered",
      name: "LAY IT ON THE LINE",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 2,
          upTo: true,
          target: {
            selector: "self",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "LAY IT ON THE LINE Whenever another character is banished, you may remove up to 2 damage from this character.",
    },
  ],
  classifications: ["Storyborn", "King"],
};
