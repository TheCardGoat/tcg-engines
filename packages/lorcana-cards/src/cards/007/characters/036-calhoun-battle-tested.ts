import type { CharacterCard } from "@tcg/lorcana-types";

export const calhounBattletested: CharacterCard = {
  id: "1sj",
  cardType: "character",
  name: "Calhoun",
  version: "Battle-Tested",
  fullName: "Calhoun - Battle-Tested",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "007",
  text: "TACTICAL ADVANTAGE When you play this character, you may choose and discard a card to give chosen opposing character -3 {S} until the start of your next turn.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 36,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e89d02771a72229278fa2e4100374bf2c2eb63e0",
  },
  abilities: [
    {
      id: "1sj-1",
      type: "triggered",
      name: "TACTICAL ADVANTAGE",
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
      text: "TACTICAL ADVANTAGE When you play this character, you may choose and discard a card to give chosen opposing character -3 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Racer"],
};
