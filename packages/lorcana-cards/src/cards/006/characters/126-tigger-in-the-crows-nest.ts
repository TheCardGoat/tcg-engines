import type { CharacterCard } from "@tcg/lorcana-types";

export const tiggerInTheCrowsNest: CharacterCard = {
  abilities: [
    {
      id: "1q4-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1q4-2",
      name: "SWASH YOUR BUCKLES",
      text: "SWASH YOUR BUCKLES Whenever you play an action, this character gets +1 {S} and +1 {L} this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 126,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Tigger", "Pirate"],
  cost: 3,
  externalIds: {
    ravensburger: "dfa8a8096bd718d380931f64e28ae3d4947a6313",
  },
  franchise: "Winnie the Pooh",
  fullName: "Tigger - In the Crow's Nest",
  id: "1q4",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Tigger",
  set: "006",
  strength: 0,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSWASH YOUR BUCKLES Whenever you play an action, this character gets +1 {S} and +1 {L} this turn.",
  version: "In the Crow's Nest",
  willpower: 4,
};
