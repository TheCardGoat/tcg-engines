import type { CharacterCard } from "@tcg/lorcana-types";

export const oswaldTheLuckyRabbit: CharacterCard = {
  id: "tu2",
  cardType: "character",
  name: "Oswald",
  version: "The Lucky Rabbit",
  fullName: "Oswald - The Lucky Rabbit",
  inkType: ["sapphire"],
  set: "006",
  text: "FAVORABLE CHANCE During your turn, whenever a card is put into your inkwell, you may reveal the top card of your deck. If it’s an item card, you may play that item for free and it enters play exerted. Otherwise, put it on the bottom of your deck.",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 2,
  cardNumber: 142,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6b871e4973f6b230175cf0b121338b49c07804fe",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};
