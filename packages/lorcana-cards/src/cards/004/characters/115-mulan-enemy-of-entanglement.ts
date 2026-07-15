import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanEnemyOfEntanglement: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1p7-1",
      name: "TIME TO SHINE",
      text: "TIME TO SHINE Whenever you play an action, this character gets +2 {S} this turn.",
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
