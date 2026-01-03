import type { CharacterCard } from "@tcg/lorcana-types";

export const HansThirteenthInLine: CharacterCard = {
  id: "1ro",
  cardType: "character",
  name: "Hans",
  version: "Thirteenth in Line",
  fullName: "Hans - Thirteenth in Line",
  inkType: ["steel"],
  franchise: "Frozen",
  set: "001",
  text: "STAGE A LITTLE ACCIDENT Whenever this character quests, you may deal 1 damage to chosen character.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 180,
  inkable: true,
  externalIds: {
    ravensburger: "e57dd5df690f5083848c5ffe191627af870b3985",
  },
  abilities: [
    {
      id: "1ro-1",
      text: "STAGE A LITTLE ACCIDENT Whenever this character quests, you may deal 1 damage to chosen character.",
      name: "STAGE A LITTLE ACCIDENT",
      type: "triggered",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 1,
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Villain", "Prince"],
};
