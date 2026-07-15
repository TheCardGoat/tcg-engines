import type { LocationCard } from "@tcg/lorcana-types";

export const ursulasLairEyeOfTheStorm: LocationCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: "CHOSEN_CHARACTER",
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "1ks-1",
      name: "SLIPPERY HALLS",
      text: "SLIPPERY HALLS Whenever a character is banished in a challenge while here, you may return them to your hand.",
      trigger: {
        event: "banish",
        on: "ANY_CHARACTER",
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "CHARACTERS_HERE",
        type: "modify-stat",
      },
      id: "1ks-2",
      text: "SEAT OF POWER Characters named Ursula get +1 {L} while here.",
      type: "action",
    },
  ],
  cardNumber: 68,
  cardType: "location",
  cost: 3,
  externalIds: {
    ravensburger: "ccaa3f7bc222e079977804dc188974a4198a6eab",
  },
  franchise: "Little Mermaid",
  fullName: "Ursula’s Lair - Eye of the Storm",
  id: "1ks",
  inkType: ["amethyst"],
  inkable: false,
  lore: 0,
  missingTests: true,
  moveCost: 2,
  name: "Ursula’s Lair",
  set: "004",
  text: "SLIPPERY HALLS Whenever a character is banished in a challenge while here, you may return them to your hand.\nSEAT OF POWER Characters named Ursula get +1 {L} while here.",
  version: "Eye of the Storm",
};
