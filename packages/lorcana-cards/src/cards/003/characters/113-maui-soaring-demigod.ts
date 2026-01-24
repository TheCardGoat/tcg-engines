import type { CharacterCard } from "@tcg/lorcana-types";

export const mauiSoaringDemigod: CharacterCard = {
  id: "q08",
  cardType: "character",
  name: "Maui",
  version: "Soaring Demigod",
  fullName: "Maui - Soaring Demigod",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "003",
  text: "Reckless (This character can't quest and must challenge each turn if able.)\nIN MA BELLY Whenever a character of yours named HeiHei quests, this character gets +1 {L} and loses Reckless this turn.",
  cost: 3,
  strength: 5,
  willpower: 2,
  lore: 0,
  cardNumber: 113,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "5dbaface98eade9dac7b113a051ff1632bc17fc4",
  },
  abilities: [
    {
      id: "q08-1",
      type: "keyword",
      keyword: "Reckless",
      text: "Reckless",
    },
    {
      id: "q08-2",
      type: "triggered",
      name: "IN MA BELLY",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
        duration: "this-turn",
      },
      text: "IN MA BELLY Whenever a character of yours named HeiHei quests, this character gets +1 {L} and loses Reckless this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Deity"],
};
