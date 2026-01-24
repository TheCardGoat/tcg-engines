import type { CharacterCard } from "@tcg/lorcana-types";

export const goldieOgiltCunningProspector: CharacterCard = {
  id: "q8j",
  cardType: "character",
  name: "Goldie O'Gilt",
  version: "Cunning Prospector",
  fullName: "Goldie O'Gilt - Cunning Prospector",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  text: "CLAIM JUMPER When you play this character, chosen opponent reveals their hand and discards a location card of your choice.\nSTRIKE GOLD Whenever this character quests, you may put a location card from chosen player's discard on the bottom of their deck to gain 1 lore.",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 87,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5e8f85b20cdbf2c38b51e2c7ba01598942074e73",
  },
  abilities: [
    {
      id: "q8j-2",
      type: "triggered",
      name: "STRIKE GOLD",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "gain-lore",
          amount: 1,
        },
        chooser: "CONTROLLER",
      },
      text: "STRIKE GOLD Whenever this character quests, you may put a location card from chosen player's discard on the bottom of their deck to gain 1 lore.",
    },
  ],
  classifications: ["Storyborn"],
};
