import type { LocationCard } from "@tcg/lorcana-types";

export const owlIslandSecludedEntrance: LocationCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "y11-1",
      text: "TEAMWORK For each character you have here, you pay 1 {I} less for the first action you play each turn.",
      type: "action",
    },
    {
      effect: {
        amount: 3,
        type: "gain-lore",
      },
      id: "y11-2",
      name: "LOTS TO LEARN",
      text: "LOTS TO LEARN Whenever you play a second action in a turn, gain 3 lore.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 102,
  cardType: "location",
  cost: 3,
  externalIds: {
    ravensburger: "7aa47d85c7274b41667c57cd8ebefe2dbe00b83c",
  },
  franchise: "Lorcana",
  fullName: "Owl Island - Secluded Entrance",
  id: "y11",
  inkType: ["emerald"],
  inkable: false,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Owl Island",
  set: "006",
  text: "TEAMWORK For each character you have here, you pay 1 {I} less for the first action you play each turn.\nLOTS TO LEARN Whenever you play a second action in a turn, gain 3 lore.",
  version: "Secluded Entrance",
};
