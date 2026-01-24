import type { LocationCard } from "@tcg/lorcana-types";

export const owlIslandSecludedEntrance: LocationCard = {
  id: "y11",
  cardType: "location",
  name: "Owl Island",
  version: "Secluded Entrance",
  fullName: "Owl Island - Secluded Entrance",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "006",
  text: "TEAMWORK For each character you have here, you pay 1 {I} less for the first action you play each turn.\nLOTS TO LEARN Whenever you play a second action in a turn, gain 3 lore.",
  cost: 3,
  moveCost: 1,
  lore: 0,
  cardNumber: 102,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "7aa47d85c7274b41667c57cd8ebefe2dbe00b83c",
  },
  abilities: [
    {
      id: "y11-1",
      type: "action",
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "TEAMWORK For each character you have here, you pay 1 {I} less for the first action you play each turn.",
    },
    {
      id: "y11-2",
      type: "triggered",
      name: "LOTS TO LEARN",
      effect: {
        type: "gain-lore",
        amount: 3,
      },
      text: "LOTS TO LEARN Whenever you play a second action in a turn, gain 3 lore.",
    },
  ],
};
