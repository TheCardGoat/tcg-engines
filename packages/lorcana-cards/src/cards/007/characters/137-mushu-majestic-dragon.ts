import type { CharacterCard } from "@tcg/lorcana-types";

export const mushuMajesticDragon: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
        value: 2,
      },
      id: "bra-1",
      name: "INTIMIDATING AND AWE-INSPIRING",
      text: "INTIMIDATING AND AWE-INSPIRING Whenever one of your characters challenges, they gain Resist +2 during that challenge.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "bra-2",
      name: "GUARDIAN OF LOST SOULS",
      text: "GUARDIAN OF LOST SOULS During your turn, whenever one of your characters banishes another character in a challenge, gain 2 lore.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 137,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Dragon"],
  cost: 5,
  externalIds: {
    ravensburger: "2a608171e87ca61b48b698e1fe5482c717572e13",
  },
  franchise: "Mulan",
  fullName: "Mushu - Majestic Dragon",
  id: "bra",
  inkType: ["ruby", "steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mushu",
  set: "007",
  strength: 4,
  text: "INTIMIDATING AND AWE-INSPIRING Whenever one of your characters challenges, they gain Resist +2 during that challenge. (Damage dealt to them is reduced by 2.)\nGUARDIAN OF LOST SOULS During your turn, whenever one of your characters banishes another character in a challenge, gain 2 lore.",
  version: "Majestic Dragon",
  willpower: 4,
};
