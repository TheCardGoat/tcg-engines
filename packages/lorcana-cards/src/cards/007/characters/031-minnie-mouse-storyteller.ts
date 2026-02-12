import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseStoryteller: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "i03-1",
      name: "GATHER AROUND",
      text: "GATHER AROUND Whenever you play a character, this character gets +1 {L} this turn.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "character",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 31,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "40e23a6aa4e9b85c3ae4a6b8a3433cc2c36a426c",
  },
  fullName: "Minnie Mouse - Storyteller",
  id: "i03",
  inkType: ["amber"],
  inkable: false,
  lore: 0,
  missingImplementation: true,
  missingTests: true,
  name: "Minnie Mouse",
  set: "007",
  strength: 1,
  text: "GATHER AROUND Whenever you play a character, this character gets +1 {L} this turn.\nJUST ONE MORE Whenever this character quests, chosen opposing character loses {S} equal to this character's {L} until the start of your next turn.",
  version: "Storyteller",
  willpower: 2,
};
