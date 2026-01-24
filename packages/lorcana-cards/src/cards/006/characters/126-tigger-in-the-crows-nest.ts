import type { CharacterCard } from "@tcg/lorcana-types";

export const tiggerInTheCrowsNest: CharacterCard = {
  id: "1q4",
  cardType: "character",
  name: "Tigger",
  version: "In the Crow's Nest",
  fullName: "Tigger - In the Crow's Nest",
  inkType: ["ruby"],
  franchise: "Winnie the Pooh",
  set: "006",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSWASH YOUR BUCKLES Whenever you play an action, this character gets +1 {S} and +1 {L} this turn.",
  cost: 3,
  strength: 0,
  willpower: 4,
  lore: 1,
  cardNumber: 126,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dfa8a8096bd718d380931f64e28ae3d4947a6313",
  },
  abilities: [
    {
      id: "1q4-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "1q4-2",
      type: "triggered",
      name: "SWASH YOUR BUCKLES",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
        duration: "this-turn",
      },
      text: "SWASH YOUR BUCKLES Whenever you play an action, this character gets +1 {S} and +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Tigger", "Pirate"],
};
