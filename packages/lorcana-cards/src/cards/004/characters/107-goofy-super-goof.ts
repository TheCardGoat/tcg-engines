import type { CharacterCard } from "@tcg/lorcana-types";

export const goofySuperGoof: CharacterCard = {
  abilities: [
    {
      id: "1n2-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "1n2-2",
      name: "SUPER PEANUT POWERS",
      text: "SUPER PEANUT POWERS Whenever this character challenges another character, gain 2 lore.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 107,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "d68e1198d53d0e18c6b1f08b1308f124fed05118",
  },
  fullName: "Goofy - Super Goof",
  id: "1n2",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Goofy",
  set: "004",
  strength: 2,
  text: "Rush (This character can challenge the turn they're played.)\nSUPER PEANUT POWERS Whenever this character challenges another character, gain 2 lore.",
  version: "Super Goof",
  willpower: 4,
};
