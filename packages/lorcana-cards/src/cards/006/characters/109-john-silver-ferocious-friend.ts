import type { CharacterCard } from "@tcg/lorcana-types";

export const johnSilverFerociousFriend: CharacterCard = {
  id: "sje",
  cardType: "character",
  name: "John Silver",
  version: "Ferocious Friend",
  fullName: "John Silver - Ferocious Friend",
  inkType: ["ruby"],
  franchise: "Treasure Planet",
  set: "006",
  text: "YOU HAVE TO CHART YOUR OWN COURSE Whenever this character quests, you may deal 1 damage to one of your other characters. If you do, ready that character. They cannot quest this turn.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 109,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "66db56b4be18bb9ae41a91fbaa0d96b74a3a3e8b",
  },
  abilities: [
    {
      id: "sje-1",
      type: "triggered",
      name: "YOU HAVE TO CHART YOUR OWN COURSE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            effect: {
              type: "deal-damage",
              amount: 1,
              target: {
                selector: "all",
                count: "all",
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
            chooser: "CONTROLLER",
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "SELF",
            duration: "this-turn",
          },
        ],
      },
      text: "YOU HAVE TO CHART YOUR OWN COURSE Whenever this character quests, you may deal 1 damage to one of your other characters. If you do, ready that character. They cannot quest this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Alien", "Pirate", "Captain"],
};
