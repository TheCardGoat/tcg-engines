import type { CharacterCard } from "@tcg/lorcana-types";

export const baymaxUpgradedRobot: CharacterCard = {
  abilities: [
    {
      id: "10n-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        type: "optional",
      },
      id: "10n-2",
      name: "ADVANCED SCANNER",
      text: "ADVANCED SCANNER When you play this character, look at the top 4 cards of your deck. You may reveal a Floodborn character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 175,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Robot"],
  cost: 5,
  externalIds: {
    ravensburger: "840d0b3ebdf82a8bbc65833ecdf99654ac7ab5ab",
  },
  franchise: "Big Hero 6",
  fullName: "Baymax - Upgraded Robot",
  id: "10n",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Baymax",
  set: "007",
  strength: 3,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nADVANCED SCANNER When you play this character, look at the top 4 cards of your deck. You may reveal a Floodborn character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  version: "Upgraded Robot",
  willpower: 5,
};
