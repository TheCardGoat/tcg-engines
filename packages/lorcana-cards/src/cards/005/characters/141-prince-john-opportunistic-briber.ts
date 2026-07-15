import type { CharacterCard } from "@tcg/lorcana-types";

export const princeJohnOpportunisticBriber: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "qie-1",
      name: "TAXES NEVER FAIL ME",
      text: "TAXES NEVER FAIL ME Whenever you play an item, this character gets +2 {S} this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "item",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 141,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Prince"],
  cost: 3,
  externalIds: {
    ravensburger: "5f8c0c0fd0e465bfd49daea0ba1e50025bacae69",
  },
  franchise: "Robin Hood",
  fullName: "Prince John - Opportunistic Briber",
  id: "qie",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Prince John",
  set: "005",
  strength: 1,
  text: "TAXES NEVER FAIL ME Whenever you play an item, this character gets +2 {S} this turn.",
  version: "Opportunistic Briber",
  willpower: 5,
};
