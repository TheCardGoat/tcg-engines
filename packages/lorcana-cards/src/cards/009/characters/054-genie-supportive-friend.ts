import type { CharacterCard } from "@tcg/lorcana-types";

export const genieSupportiveFriend: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          intoDeck: "owner",
          target: "SELF",
          type: "shuffle-into-deck",
        },
        type: "optional",
      },
      id: "146-1",
      name: "THREE WISHES",
      text: "THREE WISHES Whenever this character quests, you may shuffle this card into your deck to draw 3 cards.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 54,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "90d80de24ee17049d48985b4d1fdfe1c6f9af560",
  },
  franchise: "Aladdin",
  fullName: "Genie - Supportive Friend",
  id: "146",
  inkType: ["amethyst"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Genie",
  set: "009",
  strength: 3,
  text: "THREE WISHES Whenever this character quests, you may shuffle this card into your deck to draw 3 cards.",
  version: "Supportive Friend",
  willpower: 5,
};
