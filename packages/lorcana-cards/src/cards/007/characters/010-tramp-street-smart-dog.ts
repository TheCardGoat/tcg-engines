import type { CharacterCard } from "@tcg/lorcana-types";

export const trampStreetsmartDog: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "cost-reduction",
        amount: {
          type: "characters-in-play",
          controller: "you",
        },
      },
      id: "8g2-1",
      name: "NOW IT'S A PARTY",
      text: "NOW IT'S A PARTY For each character you have in play, you pay 1 {I} less to play this character.",
      type: "static",
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "for-each",
              counter: {
                type: "characters",
                controller: "you",
              },
              effect: {
                type: "draw",
                amount: 1,
                target: "CONTROLLER",
              },
            },
            {
              type: "discard",
              amount: {
                type: "characters-in-play",
                controller: "you",
              },
              target: "CONTROLLER",
              chosen: true,
            },
          ],
        },
      },
      id: "8g2-2",
      name: "HOW'S PICKINGS?",
      text: "HOW'S PICKINGS? When you play this character, you may draw a card for each other character you have in play, then choose and discard that many cards.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 10,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 7,
  externalIds: {
    ravensburger: "1e70debf71c03c6a1973a11689057dde2fe76b95",
  },
  franchise: "Lady and the Tramp",
  fullName: "Tramp - Street-Smart Dog",
  id: "8g2",
  inkType: ["amber", "emerald"],
  inkable: true,
  lore: 2,
  name: "Tramp",
  set: "007",
  strength: 2,
  text: "NOW IT'S A PARTY For each character you have in play, you pay 1 {I} less to play this character.\nHOW'S PICKINGS? When you play this character, you may draw a card for each other character you have in play, then choose and discard that many cards.",
  version: "Street-Smart Dog",
  willpower: 6,
};
