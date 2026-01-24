import type { CharacterCard } from "@tcg/lorcana-types";

export const mushuMajesticDragon: CharacterCard = {
  id: "bra",
  cardType: "character",
  name: "Mushu",
  version: "Majestic Dragon",
  fullName: "Mushu - Majestic Dragon",
  inkType: ["ruby", "steel"],
  franchise: "Mulan",
  set: "007",
  text: "INTIMIDATING AND AWE-INSPIRING Whenever one of your characters challenges, they gain Resist +2 during that challenge. (Damage dealt to them is reduced by 2.)\nGUARDIAN OF LOST SOULS During your turn, whenever one of your characters banishes another character in a challenge, gain 2 lore.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 1,
  cardNumber: 137,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2a608171e87ca61b48b698e1fe5482c717572e13",
  },
  abilities: [
    {
      id: "bra-1",
      type: "triggered",
      name: "INTIMIDATING AND AWE-INSPIRING",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "YOUR_CHARACTERS",
        value: 2,
      },
      text: "INTIMIDATING AND AWE-INSPIRING Whenever one of your characters challenges, they gain Resist +2 during that challenge.",
    },
    {
      id: "bra-2",
      type: "triggered",
      name: "GUARDIAN OF LOST SOULS",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
      text: "GUARDIAN OF LOST SOULS During your turn, whenever one of your characters banishes another character in a challenge, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Dragon"],
};
