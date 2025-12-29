import type { CharacterCard } from "@tcg/lorcana";

export const trampStreetsmartDog: CharacterCard = {
  id: "8g2",
  cardType: "character",
  name: "Tramp",
  version: "Street-Smart Dog",
  fullName: "Tramp - Street-Smart Dog",
  inkType: ["amber", "emerald"],
  franchise: "Lady and the Tramp",
  set: "007",
  text: "NOW IT'S A PARTY For each character you have in play, you pay 1 {I} less to play this character.\nHOW'S PICKINGS? When you play this character, you may draw a card for each other character you have in play, then choose and discard that many cards.",
  cost: 7,
  strength: 2,
  willpower: 6,
  lore: 2,
  cardNumber: 10,
  inkable: true,
  externalIds: {
    ravensburger: "1e70debf71c03c6a1973a11689057dde2fe76b95",
  },
  abilities: [
    {
      id: "8g2-1",
      text: "NOW IT'S A PARTY For each character you have in play, you pay 1 {I} less to play this character.",
      name: "NOW IT'S A PARTY",
      type: "static",
      effect: {
        type: "cost-reduction",
        amount: {
          type: "characters-in-play",
          controller: "you",
        },
      },
    },
    {
      id: "8g2-2",
      text: "HOW'S PICKINGS? When you play this character, you may draw a card for each other character you have in play, then choose and discard that many cards.",
      name: "HOW'S PICKINGS?",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
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
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
