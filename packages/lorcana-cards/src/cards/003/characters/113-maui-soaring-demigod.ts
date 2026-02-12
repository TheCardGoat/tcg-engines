import type { CharacterCard } from "@tcg/lorcana-types";

export const mauiSoaringDemigod: CharacterCard = {
  abilities: [
    {
      id: "q08-1",
      keyword: "Reckless",
      text: "Reckless",
      type: "keyword",
    },
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "q08-2",
      name: "IN MA BELLY",
      text: "IN MA BELLY Whenever a character of yours named HeiHei quests, this character gets +1 {L} and loses Reckless this turn.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 113,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Deity"],
  cost: 3,
  externalIds: {
    ravensburger: "5dbaface98eade9dac7b113a051ff1632bc17fc4",
  },
  franchise: "Moana",
  fullName: "Maui - Soaring Demigod",
  id: "q08",
  inkType: ["ruby"],
  inkable: false,
  lore: 0,
  missingTests: true,
  name: "Maui",
  set: "003",
  strength: 5,
  text: "Reckless (This character can't quest and must challenge each turn if able.)\nIN MA BELLY Whenever a character of yours named HeiHei quests, this character gets +1 {L} and loses Reckless this turn.",
  version: "Soaring Demigod",
  willpower: 2,
};
