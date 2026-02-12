import type { CharacterCard } from "@tcg/lorcana-types";

export const kingLouieJungleVip: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
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
        type: "optional",
      },
      id: "3ec-1",
      name: "LAY IT ON THE LINE",
      text: "LAY IT ON THE LINE Whenever another character is banished, you may remove up to 2 damage from this character.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 12,
  cardType: "character",
  classifications: ["Storyborn", "King"],
  cost: 7,
  externalIds: {
    ravensburger: "0c3fed9a867179785f504207a81666bcfe1b2abc",
  },
  franchise: "Jungle Book",
  fullName: "King Louie - Jungle VIP",
  id: "3ec",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "King Louie",
  set: "002",
  strength: 3,
  text: "LAY IT ON THE LINE Whenever another character is banished, you may remove up to 2 damage from this character.",
  version: "Jungle VIP",
  willpower: 8,
};
