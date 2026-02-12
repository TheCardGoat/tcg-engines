import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanEnemyOfEntanglement: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
        duration: "this-turn",
      },
      id: "1p7-1",
      name: "TIME TO SHINE",
      text: "TIME TO SHINE Whenever you play an action, this character gets +2 {S} this turn.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 115,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 2,
  externalIds: {
    ravensburger: "dc42755db5ece09465c9e80da08501b1ee99e7d1",
  },
  franchise: "Mulan",
  fullName: "Mulan - Enemy of Entanglement",
  id: "1p7",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mulan",
  set: "004",
  strength: 1,
  text: "TIME TO SHINE Whenever you play an action, this character gets +2 {S} this turn.",
  version: "Enemy of Entanglement",
  willpower: 3,
};
