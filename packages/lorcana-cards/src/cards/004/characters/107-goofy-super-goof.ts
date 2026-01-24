import type { CharacterCard } from "@tcg/lorcana-types";

export const goofySuperGoof: CharacterCard = {
  id: "1n2",
  cardType: "character",
  name: "Goofy",
  version: "Super Goof",
  fullName: "Goofy - Super Goof",
  inkType: ["ruby"],
  set: "004",
  text: "Rush (This character can challenge the turn they're played.)\nSUPER PEANUT POWERS Whenever this character challenges another character, gain 2 lore.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 107,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d68e1198d53d0e18c6b1f08b1308f124fed05118",
  },
  abilities: [
    {
      id: "1n2-1",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
    {
      id: "1n2-2",
      type: "triggered",
      name: "SUPER PEANUT POWERS",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
      text: "SUPER PEANUT POWERS Whenever this character challenges another character, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
