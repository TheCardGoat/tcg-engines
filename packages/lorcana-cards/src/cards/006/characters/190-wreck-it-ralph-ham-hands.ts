import type { CharacterCard } from "@tcg/lorcana-types";

export const wreckitRalphHamHands: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          type: "gain-lore",
        },
        type: "optional",
      },
      id: "1h8-1",
      name: "I WRECK THINGS",
      text: "I WRECK THINGS Whenever this character quests, you may banish chosen item or location to gain 2 lore.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 190,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 6,
  externalIds: {
    ravensburger: "bfd14e420afb55f030d821dddadf7a624938d2af",
  },
  franchise: "Wreck It Ralph",
  fullName: "Wreck-It Ralph - Ham Hands",
  id: "1h8",
  inkType: ["steel"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Wreck-It Ralph",
  set: "006",
  strength: 4,
  text: "I WRECK THINGS Whenever this character quests, you may banish chosen item or location to gain 2 lore.",
  version: "Ham Hands",
  willpower: 4,
};
