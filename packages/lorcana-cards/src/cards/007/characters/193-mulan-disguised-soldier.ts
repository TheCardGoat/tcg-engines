import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanDisguisedSoldier: CharacterCard = {
  id: "1p3",
  cardType: "character",
  name: "Mulan",
  version: "Disguised Soldier",
  fullName: "Mulan - Disguised Soldier",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "007",
  text: "WHERE DO I SIGN IN? When you play this character, you may draw a card, then choose and discard a card.",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 193,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dc468c676e85ae64384d43f7358b0f77eac28102",
  },
  abilities: [
    {
      id: "1p3-1",
      type: "triggered",
      name: "WHERE DO I SIGN IN?",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "discard",
          amount: 1,
          target: "CONTROLLER",
          chosen: true,
        },
        chooser: "CONTROLLER",
      },
      text: "WHERE DO I SIGN IN? When you play this character, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
