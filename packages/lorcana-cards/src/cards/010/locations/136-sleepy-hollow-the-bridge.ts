import type { LocationCard } from "@tcg/lorcana-types";

export const sleepyHollowTheBridge: LocationCard = {
  id: "z63",
  cardType: "location",
  name: "Sleepy Hollow",
  version: "The Bridge",
  fullName: "Sleepy Hollow - The Bridge",
  inkType: ["ruby"],
  franchise: "Sleepy Hollow",
  set: "010",
  text: "HEAD FOR THE BRIDGE! Whenever a character quests while here, you may banish this location to gain 2 lore and give them Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  cost: 3,
  moveCost: 1,
  lore: 0,
  cardNumber: 136,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7ec0ca5165f108cb73d1156e881760489fbbf725",
  },
  abilities: [
    {
      id: "z63-1",
      type: "triggered",
      name: "HEAD FOR THE BRIDGE!",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "optional",
        effect: {
          type: "gain-lore",
          amount: 2,
        },
        chooser: "CONTROLLER",
      },
      text: "HEAD FOR THE BRIDGE! Whenever a character quests while here, you may banish this location to gain 2 lore and give them Evasive until the start of your next turn.",
    },
  ],
};
