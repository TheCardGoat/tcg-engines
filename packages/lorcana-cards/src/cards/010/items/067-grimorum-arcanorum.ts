import type { ItemCard } from "@tcg/lorcana-types";

export const grimorumArcanorum: ItemCard = {
  id: "177",
  cardType: "item",
  name: "Grimorum Arcanorum",
  inkType: ["amethyst"],
  franchise: "Gargoyles",
  set: "010",
  text: "DOCTRINA ADDUCERE During your turn, whenever an opposing character becomes exerted, gain 1 lore.\nCELERITAS Your characters named Demona gain Rush. (They can challenge the turn they're played.)",
  cost: 3,
  cardNumber: 67,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9dbf9b2d631d70b21894d535fad283d18273b6cd",
  },
  abilities: [
    {
      id: "177-1",
      type: "triggered",
      name: "DOCTRINA ADDUCERE",
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "DOCTRINA ADDUCERE During your turn, whenever an opposing character becomes exerted, gain 1 lore.",
    },
    {
      id: "177-2",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "YOUR_CHARACTERS",
      },
      text: "CELERITAS Your characters named Demona gain Rush.",
    },
  ],
};
