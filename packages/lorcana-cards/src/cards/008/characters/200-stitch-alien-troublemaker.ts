import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchAlienTroublemaker: CharacterCard = {
  id: "aiz",
  cardType: "character",
  name: "Stitch",
  version: "Alien Troublemaker",
  fullName: "Stitch - Alien Troublemaker",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "008",
  text: "I WIN! During your turn, whenever this character banishes another character in a challenge, you may draw a card and gain 1 lore.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 200,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "25f0dc4e3fd1b1b13365fcf75768ebd9490bc9d6",
  },
  abilities: [
    {
      id: "aiz-1",
      type: "triggered",
      name: "I WIN!",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "gain-lore",
          amount: 1,
        },
        chooser: "CONTROLLER",
      },
      text: "I WIN! During your turn, whenever this character banishes another character in a challenge, you may draw a card and gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Alien"],
};
