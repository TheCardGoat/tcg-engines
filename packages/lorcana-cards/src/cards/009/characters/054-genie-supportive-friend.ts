import type { CharacterCard } from "@tcg/lorcana-types";

export const genieSupportiveFriend: CharacterCard = {
  id: "146",
  cardType: "character",
  name: "Genie",
  version: "Supportive Friend",
  fullName: "Genie - Supportive Friend",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "009",
  text: "THREE WISHES Whenever this character quests, you may shuffle this card into your deck to draw 3 cards.",
  cost: 4,
  strength: 3,
  willpower: 5,
  lore: 1,
  cardNumber: 54,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "90d80de24ee17049d48985b4d1fdfe1c6f9af560",
  },
  abilities: [
    {
      id: "146-1",
      type: "triggered",
      name: "THREE WISHES",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "shuffle-into-deck",
          target: "SELF",
          intoDeck: "owner",
        },
        chooser: "CONTROLLER",
      },
      text: "THREE WISHES Whenever this character quests, you may shuffle this card into your deck to draw 3 cards.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
