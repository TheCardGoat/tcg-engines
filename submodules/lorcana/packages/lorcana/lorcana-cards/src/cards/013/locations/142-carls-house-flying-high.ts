import type { LocationCard } from "@tcg/lorcana-types";
import { carlsHouseFlyingHighI18n } from "./142-carls-house-flying-high.i18n";

export const carlsHouseFlyingHigh: LocationCard = {
  id: "Zwu",
  canonicalId: "ci_Zwu",
  slug: "lorcana-ci_Zwu",
  printings: [
    {
      id: "set13-142",
      artId: "set13-142",
      setCode: "set13",
      collectorNumber: "142",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-142"],
  cardType: "location",
  name: "Carl's House",
  version: "Flying High",
  inkType: ["ruby"],
  franchise: "Up",
  set: "013",
  cardNumber: 142,
  rarity: "rare",
  cost: 2,
  willpower: 6,
  moveCost: 0,
  lore: 0,
  inkable: true,
  text: [
    {
      title: "Moving Day",
      description:
        "Once during your turn, you may move chosen character from here to another location for free. If you do, gain 1 lore.",
    },
  ],
  abilities: [
    {
      type: "activated",
      name: "MOVING DAY",
      text: "MOVING DAY Once during your turn, you may move chosen character from here to another location for free. If you do, gain 1 lore.",
      cost: {},
      usesPerTurn: 1,
      restrictions: [
        {
          type: "during-turn",
          whose: "your",
        },
      ],
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "move-to-location",
          cost: "free",
          character: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [
              {
                type: "same-location-as-source",
              },
            ],
          },
          location: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["play"],
            cardTypes: ["location"],
            excludeSelf: true,
          },
          forEach: [
            {
              type: "gain-lore",
              amount: 1,
            },
          ],
        },
      },
    },
  ],
  i18n: carlsHouseFlyingHighI18n,
};
