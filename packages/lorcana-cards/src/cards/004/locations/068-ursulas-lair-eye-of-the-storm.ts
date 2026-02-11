import type { LocationCard } from "@tcg/lorcana-types";

export const ursulasLairEyeOfTheStorm: LocationCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      id: "1ks-1",
      name: "SLIPPERY HALLS",
      text: "SLIPPERY HALLS Whenever a character is banished in a challenge while here, you may return them to your hand.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "ANY_CHARACTER",
      },
      type: "triggered",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "CHARACTERS_HERE",
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
