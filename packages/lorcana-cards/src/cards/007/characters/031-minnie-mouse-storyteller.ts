import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseStoryteller: CharacterCard = {
  id: "i03",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Storyteller",
  fullName: "Minnie Mouse - Storyteller",
  inkType: ["amber"],
  set: "007",
  text: "GATHER AROUND Whenever you play a character, this character gets +1 {L} this turn.\nJUST ONE MORE Whenever this character quests, chosen opposing character loses {S} equal to this character's {L} until the start of your next turn.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 0,
  cardNumber: 31,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "40e23a6aa4e9b85c3ae4a6b8a3433cc2c36a426c",
  },
  abilities: [
    {
      id: "i03-1",
      type: "triggered",
      name: "GATHER AROUND",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
        duration: "this-turn",
      },
      text: "GATHER AROUND Whenever you play a character, this character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
