import type { CharacterCard } from "@tcg/lorcana-types";

export const wreckitRalphHamHands: CharacterCard = {
  id: "1h8",
  cardType: "character",
  name: "Wreck-It Ralph",
  version: "Ham Hands",
  fullName: "Wreck-It Ralph - Ham Hands",
  inkType: ["steel"],
  franchise: "Wreck It Ralph",
  set: "006",
  text: "I WRECK THINGS Whenever this character quests, you may banish chosen item or location to gain 2 lore.",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 3,
  cardNumber: 190,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "bfd14e420afb55f030d821dddadf7a624938d2af",
  },
  abilities: [
    {
      id: "1h8-1",
      type: "triggered",
      name: "I WRECK THINGS",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "gain-lore",
          amount: 2,
        },
        chooser: "CONTROLLER",
      },
      text: "I WRECK THINGS Whenever this character quests, you may banish chosen item or location to gain 2 lore.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
