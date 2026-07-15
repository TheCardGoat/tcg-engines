import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanDisguisedSoldier: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          chosen: true,
          target: "CONTROLLER",
          type: "discard",
        },
        type: "optional",
      },
      id: "1p3-1",
      name: "WHERE DO I SIGN IN?",
      text: "WHERE DO I SIGN IN? When you play this character, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 193,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 1,
  externalIds: {
    ravensburger: "dc468c676e85ae64384d43f7358b0f77eac28102",
  },
  franchise: "Mulan",
  fullName: "Mulan - Disguised Soldier",
  id: "1p3",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mulan",
  set: "007",
  strength: 2,
  text: "WHERE DO I SIGN IN? When you play this character, you may draw a card, then choose and discard a card.",
  version: "Disguised Soldier",
  willpower: 1,
};
