import type { CharacterCard } from "@tcg/lorcana-types";

export const alanadaleRockinRooster: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "ow8-1",
      name: "FAN FAVORITE",
      text: "FAN FAVORITE Whenever you play a song, gain 1 lore.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 20,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "59b96144e20a1e20918bd0fd047597fe1d9505a7",
  },
  franchise: "Robin Hood",
  fullName: "Alan-a-Dale - Rockin' Rooster",
  id: "ow8",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Alan-a-Dale",
  set: "005",
  strength: 2,
  text: "FAN FAVORITE Whenever you play a song, gain 1 lore.",
  version: "Rockin' Rooster",
  willpower: 3,
};
