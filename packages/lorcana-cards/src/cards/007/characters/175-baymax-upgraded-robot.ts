import type { CharacterCard } from "@tcg/lorcana-types";

export const baymaxUpgradedRobot: CharacterCard = {
  id: "10n",
  cardType: "character",
  name: "Baymax",
  version: "Upgraded Robot",
  fullName: "Baymax - Upgraded Robot",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "007",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nADVANCED SCANNER When you play this character, look at the top 4 cards of your deck. You may reveal a Floodborn character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 1,
  cardNumber: 175,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "840d0b3ebdf82a8bbc65833ecdf99654ac7ab5ab",
  },
  abilities: [
    {
      id: "10n-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
    {
      id: "10n-2",
      type: "triggered",
      name: "ADVANCED SCANNER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      text: "ADVANCED SCANNER When you play this character, look at the top 4 cards of your deck. You may reveal a Floodborn character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Robot"],
};
