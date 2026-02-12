import type { ItemCard } from "@tcg/lorcana-types";

export const grimorumArcanorum: ItemCard = {
  abilities: [
    {
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "177-1",
      name: "DOCTRINA ADDUCERE",
      text: "DOCTRINA ADDUCERE During your turn, whenever an opposing character becomes exerted, gain 1 lore.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "YOUR_CHARACTERS",
      },
      id: "177-2",
      text: "CELERITAS Your characters named Demona gain Rush.",
      type: "action",
    },
  ],
  cardNumber: 67,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "9dbf9b2d631d70b21894d535fad283d18273b6cd",
  },
  franchise: "Gargoyles",
  id: "177",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "Grimorum Arcanorum",
  set: "010",
  text: "DOCTRINA ADDUCERE During your turn, whenever an opposing character becomes exerted, gain 1 lore.\nCELERITAS Your characters named Demona gain Rush. (They can challenge the turn they're played.)",
};
