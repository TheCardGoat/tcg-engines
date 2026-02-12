import type { LocationCard } from "@tcg/lorcana-types";

export const duckburgFunsosFunzone: LocationCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "bzp-1",
      name: "WHERE FUN IS IN THE ZONE",
      text: "WHERE FUN IS IN THE ZONE Whenever a character quests while here, you pay 2 less for the next character you play this turn.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 34,
  cardType: "location",
  cost: 2,
  externalIds: {
    ravensburger: "2b3838583e2e8871ac10dd14e13f3835d7057408",
  },
  franchise: "Ducktales",
  fullName: "Duckburg - Funso’s Funzone",
  id: "bzp",
  inkType: ["amber"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 2,
  name: "Duckburg",
  set: "010",
  text: "WHERE FUN IS IN THE ZONE Whenever a character quests while here, you pay 2 less for the next character you play this turn.",
  version: "Funso’s Funzone",
};
