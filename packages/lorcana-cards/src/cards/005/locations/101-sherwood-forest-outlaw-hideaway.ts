import type { LocationCard } from "@tcg/lorcana";

export const sherwoodForestOutlawHideaway: LocationCard = {
  id: "1kh",
  cardType: "location",
  name: "Sherwood Forest",
  version: "Outlaw Hideaway",
  fullName: "Sherwood Forest - Outlaw Hideaway",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "005",
  text: "FOREST HOME Your characters named Robin Hood may move here for free.\nFAMILIAR TERRAIN Characters gain Ward and “{E}, 1 {I} — Deal 2 damage to chosen damaged character” while here. (Opponents can't choose them except to challenge.)",
  cost: 2,
  moveCost: 2,
  lore: 0,
  cardNumber: 101,
  inkable: true,
  externalIds: {
    ravensburger: "cb0b3f11503ac2065fa15cb7f7ee80a1d45319a9",
  },
  abilities: [
    {
      id: "1kh-1",
      text: "FOREST HOME Your characters named Robin Hood may move here for free.",
      name: "FOREST HOME",
      type: "static",
      effect: {
        type: "free-move-here",
        filter: {
          type: "name",
          name: "Robin Hood",
        },
      },
    },
    {
      id: "1kh-2",
      text: "FAMILIAR TERRAIN Characters gain Ward and “{E}, {d} {I} — Deal {d} damage to chosen damaged character” while here.",
      name: "FAMILIAR TERRAIN",
      type: "static",
      effect: {
        type: "grant-abilities-while-here",
        abilities: [
          {
            type: "keyword",
            keyword: "Ward",
          },
          {
            type: "activated",
            cost: {
              exert: true,
              ink: 0,
            },
            effect: {
              type: "deal-damage",
              amount: 0,
              target: {
                selector: "chosen",
                filters: [
                  {
                    type: "damaged",
                  },
                ],
              },
            },
          },
        ],
      },
    },
  ],
};
