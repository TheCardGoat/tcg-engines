import type { CharacterCard } from "@tcg/lorcana-types";

export const henWenPropheticPig: CharacterCard = {
  abilities: [
    {
      effect: {
        target: "CHOSEN_CHARACTER",
        type: "put-on-bottom",
      },
      id: "1ms-1",
      name: "FUTURE SIGHT",
      text: "FUTURE SIGHT Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 138,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "d3e6bc36dde0bb79b16e1217817d3d1be299ac50",
  },
  franchise: "Black Cauldron",
  fullName: "Hen Wen - Prophetic Pig",
  id: "1ms",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Hen Wen",
  set: "010",
  strength: 1,
  text: "FUTURE SIGHT Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  version: "Prophetic Pig",
  willpower: 4,
};
