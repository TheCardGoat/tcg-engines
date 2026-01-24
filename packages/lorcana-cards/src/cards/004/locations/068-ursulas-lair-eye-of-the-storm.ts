import type { LocationCard } from "@tcg/lorcana-types";

export const ursulasLairEyeOfTheStorm: LocationCard = {
  id: "1ks",
  cardType: "location",
  name: "Ursula’s Lair",
  version: "Eye of the Storm",
  fullName: "Ursula’s Lair - Eye of the Storm",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "004",
  text: "SLIPPERY HALLS Whenever a character is banished in a challenge while here, you may return them to your hand.\nSEAT OF POWER Characters named Ursula get +1 {L} while here.",
  cost: 3,
  moveCost: 2,
  lore: 0,
  cardNumber: 68,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "ccaa3f7bc222e079977804dc188974a4198a6eab",
  },
  abilities: [
    {
      id: "1ks-1",
      type: "triggered",
      name: "SLIPPERY HALLS",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "ANY_CHARACTER",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      text: "SLIPPERY HALLS Whenever a character is banished in a challenge while here, you may return them to your hand.",
    },
    {
      id: "1ks-2",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHARACTERS_HERE",
      },
      text: "SEAT OF POWER Characters named Ursula get +1 {L} while here.",
    },
  ],
};
