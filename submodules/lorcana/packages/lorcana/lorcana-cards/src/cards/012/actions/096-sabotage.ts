import type { ActionCard } from "@tcg/lorcana-types";
import { sabotageI18n } from "./096-sabotage.i18n";

export const sabotage: ActionCard = {
  id: "TZW",
  canonicalId: "ci_TZW",
  slug: "lorcana-ci_TZW",
  printings: [
    {
      id: "set12-096",
      artId: "set12-096",
      setCode: "set12",
      collectorNumber: "96",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-096"],
  cardType: "action",
  name: "Sabotage",
  inkType: ["emerald"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 96,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_07d93727337b490faacc8c389b60e22d",
    tcgPlayer: "692168",
  },
  text: "Banish chosen item or location and all other items or locations with the same name.",
  abilities: [
    {
      type: "action",
      text: "Banish chosen item or location and all other items or locations with the same name.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["item", "location"],
            },
          },
          {
            type: "banish",
            target: {
              selector: "all",
              count: "all",
              owner: "any",
              zones: ["play"],
              cardTypes: ["item", "location"],
              filter: {
                sameNameAsChosenCard: true,
              },
            },
          },
        ],
      },
    },
  ],
  i18n: sabotageI18n,
};
