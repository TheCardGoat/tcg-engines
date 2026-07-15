import type { ActionCard } from "@tcg/lorcana-types";
import { touchTheSkyI18n } from "./199-touch-the-sky.i18n";

export const touchTheSky: ActionCard = {
  id: "kgN",
  canonicalId: "ci_kgN",
  slug: "lorcana-ci_kgN",
  printings: [
    {
      id: "set12-199",
      artId: "set12-199",
      setCode: "set12",
      collectorNumber: "199",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set12-199"],
  cardType: "action",
  name: "Touch the Sky",
  inkType: ["steel"],
  franchise: "Brave",
  set: "012",
  cardNumber: 199,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_baeb30c2d1dd4756b259daeb2833fad4",
    tcgPlayer: "692091",
  },
  text: "Move a character of yours to a location for free. Then, draw cards equal to that location's {L}.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "move-to-location",
            cost: "free",
            character: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
            location: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["location"],
            },
          },
          {
            type: "draw",
            target: "CONTROLLER",
            amount: {
              type: "target-location-attribute",
              attribute: "lore",
            },
          },
        ],
      },
    },
  ],
  i18n: touchTheSkyI18n,
};
