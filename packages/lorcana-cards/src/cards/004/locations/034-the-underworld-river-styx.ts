import type { LocationCard } from "@tcg/lorcana-types";

export const theUnderworldRiverStyx: LocationCard = {
  id: "6fe",
  cardType: "location",
  name: "The Underworld",
  version: "River Styx",
  fullName: "The Underworld - River Styx",
  inkType: ["amber"],
  franchise: "Hercules",
  set: "004",
  text: "SAVE A SOUL Whenever a character quests while here, you may pay 3 {I} to return a character card from your discard to your hand.",
  cost: 2,
  moveCost: 2,
  lore: 0,
  cardNumber: 34,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "172aa537f6281e65f28f8367da7244dd30dfc468",
  },
  abilities: [
    {
      id: "6fe-1",
      type: "triggered",
      name: "SAVE A SOUL",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "optional",
        effect: {
          type: "return-from-discard",
          target: "CONTROLLER",
          cardType: "character",
        },
        chooser: "CONTROLLER",
      },
      text: "SAVE A SOUL Whenever a character quests while here, you may pay 3 {I} to return a character card from your discard to your hand.",
    },
  ],
};
