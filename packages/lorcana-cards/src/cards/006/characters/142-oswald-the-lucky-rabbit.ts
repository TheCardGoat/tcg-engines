import type { CharacterCard } from "@tcg/lorcana-types";

export const oswaldTheLuckyRabbit: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "it’s an item card",
        },
        then: {
          type: "restriction",
          restriction: "enters-play-exerted",
          target: "SELF",
        },
        type: "conditional",
      },
      id: "tu2-1",
      name: "FAVORABLE CHANCE",
      text: "FAVORABLE CHANCE During your turn, whenever a card is put into your inkwell, you may reveal the top card of your deck. If it’s an item card, you may play that item for free and it enters play exerted. Otherwise, put it on the bottom of your deck.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 142,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "6b871e4973f6b230175cf0b121338b49c07804fe",
  },
  fullName: "Oswald - The Lucky Rabbit",
  id: "tu2",
  inkType: ["sapphire"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Oswald",
  set: "006",
  strength: 2,
  text: "FAVORABLE CHANCE During your turn, whenever a card is put into your inkwell, you may reveal the top card of your deck. If it’s an item card, you may play that item for free and it enters play exerted. Otherwise, put it on the bottom of your deck.",
  version: "The Lucky Rabbit",
  willpower: 1,
};
