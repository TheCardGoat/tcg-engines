import type { CharacterCard } from "@tcg/lorcana-types";

export const liloCausingAnUproar: CharacterCard = {
  id: "1to",
  cardType: "character",
  name: "Lilo",
  version: "Causing an Uproar",
  fullName: "Lilo - Causing an Uproar",
  inkType: ["ruby"],
  franchise: "Lilo and Stitch",
  set: "008",
  text: "STOMPIN' TIME! During your turn, if you've played 3 or more actions this turn, you may play this character for free.\nRAAAWR! When you play this character, ready chosen character. They can't quest for the rest of this turn.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 137,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ecb4f04c3bd04d5b7ad76abd0228dedf39ef4610",
  },
  abilities: [
    {
      id: "1to-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you've played 3 or more actions this turn",
        },
        then: {
          type: "play-card",
          from: "hand",
          cost: "free",
        },
      },
      text: "STOMPIN' TIME! During your turn, if you've played 3 or more actions this turn, you may play this character for free.",
    },
    {
      id: "1to-2",
      type: "triggered",
      name: "RAAAWR!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "play-card",
            from: "hand",
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "SELF",
            duration: "this-turn",
          },
        ],
      },
      text: "RAAAWR! When you play this character, ready chosen character. They can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
