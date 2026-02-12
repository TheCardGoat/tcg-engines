import type { CharacterCard } from "@tcg/lorcana-types";

export const liloCausingAnUproar: CharacterCard = {
  abilities: [
    {
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
      id: "1to-1",
      text: "STOMPIN' TIME! During your turn, if you've played 3 or more actions this turn, you may play this character for free.",
      type: "action",
    },
    {
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
      id: "1to-2",
      name: "RAAAWR!",
      text: "RAAAWR! When you play this character, ready chosen character. They can't quest for the rest of this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 137,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "ecb4f04c3bd04d5b7ad76abd0228dedf39ef4610",
  },
  franchise: "Lilo and Stitch",
  fullName: "Lilo - Causing an Uproar",
  id: "1to",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Lilo",
  set: "008",
  strength: 4,
  text: "STOMPIN' TIME! During your turn, if you've played 3 or more actions this turn, you may play this character for free.\nRAAAWR! When you play this character, ready chosen character. They can't quest for the rest of this turn.",
  version: "Causing an Uproar",
  willpower: 4,
};
