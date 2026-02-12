import type { CharacterCard } from "@tcg/lorcana-types";

export const calhounBattletested: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "discard",
          amount: 1,
          target: "CONTROLLER",
          chosen: true,
        },
        type: "optional",
      },
      id: "1sj-1",
      name: "TACTICAL ADVANTAGE",
      text: "TACTICAL ADVANTAGE When you play this character, you may choose and discard a card to give chosen opposing character -3 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 36,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Racer"],
  cost: 3,
  externalIds: {
    ravensburger: "e89d02771a72229278fa2e4100374bf2c2eb63e0",
  },
  franchise: "Wreck It Ralph",
  fullName: "Calhoun - Battle-Tested",
  id: "1sj",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Calhoun",
  set: "007",
  strength: 2,
  text: "TACTICAL ADVANTAGE When you play this character, you may choose and discard a card to give chosen opposing character -3 {S} until the start of your next turn.",
  version: "Battle-Tested",
  willpower: 4,
};
