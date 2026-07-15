import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanConsiderateDiplomat: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "CHOSEN_CHARACTER",
          type: "put-on-bottom",
        },
        type: "optional",
      },
      id: "1t2-1",
      name: "IMPERIAL INVITATION",
      text: "IMPERIAL INVITATION Whenever this character quests, look at the top 4 cards of your deck. You may reveal a Princess character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 142,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 5,
  externalIds: {
    ravensburger: "ea88882b3f4acc19ba2c6ab0bbd81759c55e6677",
  },
  franchise: "Mulan",
  fullName: "Mulan - Considerate Diplomat",
  id: "1t2",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Mulan",
  set: "009",
  strength: 3,
  text: "IMPERIAL INVITATION Whenever this character quests, look at the top 4 cards of your deck. You may reveal a Princess character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  version: "Considerate Diplomat",
  willpower: 5,
};
