import type { CharacterCard } from "@tcg/lorcana-types";

export const johnSilverFerociousFriend: CharacterCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            chooser: "CONTROLLER",
            effect: {
              amount: 1,
              target: {
                cardTypes: ["character"],
                count: "all",
                owner: "any",
                selector: "all",
                zones: ["play"],
              },
              type: "deal-damage",
            },
            type: "optional",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: "SELF",
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "sje-1",
      name: "YOU HAVE TO CHART YOUR OWN COURSE",
      text: "YOU HAVE TO CHART YOUR OWN COURSE Whenever this character quests, you may deal 1 damage to one of your other characters. If you do, ready that character. They cannot quest this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 109,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Alien", "Pirate", "Captain"],
  cost: 4,
  externalIds: {
    ravensburger: "66db56b4be18bb9ae41a91fbaa0d96b74a3a3e8b",
  },
  franchise: "Treasure Planet",
  fullName: "John Silver - Ferocious Friend",
  id: "sje",
  inkType: ["ruby"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "John Silver",
  set: "006",
  strength: 2,
  text: "YOU HAVE TO CHART YOUR OWN COURSE Whenever this character quests, you may deal 1 damage to one of your other characters. If you do, ready that character. They cannot quest this turn.",
  version: "Ferocious Friend",
  willpower: 4,
};
