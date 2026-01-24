import type { CharacterCard } from "@tcg/lorcana-types";

export const alanadaleRockinRooster: CharacterCard = {
  id: "ow8",
  cardType: "character",
  name: "Alan-a-Dale",
  version: "Rockin' Rooster",
  fullName: "Alan-a-Dale - Rockin' Rooster",
  inkType: ["amber"],
  franchise: "Robin Hood",
  set: "005",
  text: "FAN FAVORITE Whenever you play a song, gain 1 lore.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 20,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "59b96144e20a1e20918bd0fd047597fe1d9505a7",
  },
  abilities: [
    {
      id: "ow8-1",
      type: "triggered",
      name: "FAN FAVORITE",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "FAN FAVORITE Whenever you play a song, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
