import type { CharacterCard } from "@tcg/lorcana-types";

export const goldieOgiltCunningProspector: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "gain-lore",
          amount: 1,
        },
        chooser: "CONTROLLER",
      },
      id: "q8j-2",
      name: "STRIKE GOLD",
      text: "STRIKE GOLD Whenever this character quests, you may put a location card from chosen player's discard on the bottom of their deck to gain 1 lore.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 87,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 3,
  externalIds: {
    ravensburger: "5e8f85b20cdbf2c38b51e2c7ba01598942074e73",
  },
  franchise: "Ducktales",
  fullName: "Goldie O'Gilt - Cunning Prospector",
  id: "q8j",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Goldie O'Gilt",
  set: "010",
  strength: 3,
  text: "CLAIM JUMPER When you play this character, chosen opponent reveals their hand and discards a location card of your choice.\nSTRIKE GOLD Whenever this character quests, you may put a location card from chosen player's discard on the bottom of their deck to gain 1 lore.",
  version: "Cunning Prospector",
  willpower: 4,
};
