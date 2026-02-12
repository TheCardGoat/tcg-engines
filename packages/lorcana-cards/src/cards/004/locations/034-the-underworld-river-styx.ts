import type { LocationCard } from "@tcg/lorcana-types";

export const theUnderworldRiverStyx: LocationCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "return-from-discard",
          target: "CONTROLLER",
          cardType: "character",
        },
        chooser: "CONTROLLER",
      },
      id: "6fe-1",
      name: "SAVE A SOUL",
      text: "SAVE A SOUL Whenever a character quests while here, you may pay 3 {I} to return a character card from your discard to your hand.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 34,
  cardType: "location",
  cost: 2,
  externalIds: {
    ravensburger: "172aa537f6281e65f28f8367da7244dd30dfc468",
  },
  franchise: "Hercules",
  fullName: "The Underworld - River Styx",
  id: "6fe",
  inkType: ["amber"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 2,
  name: "The Underworld",
  set: "004",
  text: "SAVE A SOUL Whenever a character quests while here, you may pay 3 {I} to return a character card from your discard to your hand.",
  version: "River Styx",
};
