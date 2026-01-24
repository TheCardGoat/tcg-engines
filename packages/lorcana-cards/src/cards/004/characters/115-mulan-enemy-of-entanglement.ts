import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanEnemyOfEntanglement: CharacterCard = {
  id: "1p7",
  cardType: "character",
  name: "Mulan",
  version: "Enemy of Entanglement",
  fullName: "Mulan - Enemy of Entanglement",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "004",
  text: "TIME TO SHINE Whenever you play an action, this character gets +2 {S} this turn.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 115,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dc42755db5ece09465c9e80da08501b1ee99e7d1",
  },
  abilities: [
    {
      id: "1p7-1",
      type: "triggered",
      name: "TIME TO SHINE",
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
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
      text: "TIME TO SHINE Whenever you play an action, this character gets +2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
