import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanConsiderateDiplomat: CharacterCard = {
  id: "1t2",
  cardType: "character",
  name: "Mulan",
  version: "Considerate Diplomat",
  fullName: "Mulan - Considerate Diplomat",
  inkType: ["sapphire"],
  franchise: "Mulan",
  set: "009",
  text: "IMPERIAL INVITATION Whenever this character quests, look at the top 4 cards of your deck. You may reveal a Princess character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 142,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ea88882b3f4acc19ba2c6ab0bbd81759c55e6677",
  },
  abilities: [
    {
      id: "1t2-1",
      type: "triggered",
      name: "IMPERIAL INVITATION",
      trigger: {
        event: "quest",
        timing: "whenever",
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
      text: "IMPERIAL INVITATION Whenever this character quests, look at the top 4 cards of your deck. You may reveal a Princess character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
