import type { CharacterCard } from "@tcg/lorcana-types";

export const madameMedusaDiamondLover: CharacterCard = {
  id: "13m",
  cardType: "character",
  name: "Madame Medusa",
  version: "Diamond Lover",
  fullName: "Madame Medusa - Diamond Lover",
  inkType: ["amethyst", "ruby"],
  franchise: "Rescuers",
  set: "007",
  text: "SEARCH THE SWAMP Whenever this character quests, you may deal 2 damage to another chosen character of yours to put the top 3 cards of chosen player's deck into their discard.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 53,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8ec81683de9edc28cff895c40262318d9597be87",
  },
  abilities: [
    {
      id: "13m-1",
      type: "triggered",
      name: "SEARCH THE SWAMP",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "SEARCH THE SWAMP Whenever this character quests, you may deal 2 damage to another chosen character of yours to put the top 3 cards of chosen player's deck into their discard.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
