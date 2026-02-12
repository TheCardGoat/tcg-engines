import type { ItemCard } from "@tcg/lorcana-types";

export const grimorumArcanorum: ItemCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "177-1",
      name: "DOCTRINA ADDUCERE",
      text: "DOCTRINA ADDUCERE During your turn, whenever an opposing character becomes exerted, gain 1 lore.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
    {
      effect: {
        keyword: "Rush",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
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
