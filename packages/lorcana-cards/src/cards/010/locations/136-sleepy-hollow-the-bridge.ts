import type { LocationCard } from "@tcg/lorcana-types";

export const sleepyHollowTheBridge: LocationCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          type: "gain-lore",
        },
        type: "optional",
      },
      id: "z63-1",
      name: "HEAD FOR THE BRIDGE!",
      text: "HEAD FOR THE BRIDGE! Whenever a character quests while here, you may banish this location to gain 2 lore and give them Evasive until the start of your next turn.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 136,
  cardType: "location",
  cost: 3,
  externalIds: {
    ravensburger: "7ec0ca5165f108cb73d1156e881760489fbbf725",
  },
  franchise: "Sleepy Hollow",
  fullName: "Sleepy Hollow - The Bridge",
  id: "z63",
  inkType: ["ruby"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Sleepy Hollow",
  set: "010",
  text: "HEAD FOR THE BRIDGE! Whenever a character quests while here, you may banish this location to gain 2 lore and give them Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  version: "The Bridge",
};
