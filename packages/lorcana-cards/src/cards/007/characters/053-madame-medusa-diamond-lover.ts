import type { CharacterCard } from "@tcg/lorcana-types";

export const madameMedusaDiamondLover: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "13m-1",
      name: "SEARCH THE SWAMP",
      text: "SEARCH THE SWAMP Whenever this character quests, you may deal 2 damage to another chosen character of yours to put the top 3 cards of chosen player's deck into their discard.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 53,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 4,
  externalIds: {
    ravensburger: "8ec81683de9edc28cff895c40262318d9597be87",
  },
  franchise: "Rescuers",
  fullName: "Madame Medusa - Diamond Lover",
  id: "13m",
  inkType: ["amethyst", "ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Madame Medusa",
  set: "007",
  strength: 3,
  text: "SEARCH THE SWAMP Whenever this character quests, you may deal 2 damage to another chosen character of yours to put the top 3 cards of chosen player's deck into their discard.",
  version: "Diamond Lover",
  willpower: 4,
};
