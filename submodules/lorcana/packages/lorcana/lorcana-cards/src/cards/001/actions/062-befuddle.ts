import type { ActionCard } from "@tcg/lorcana-types";
import { befuddleI18n } from "./062-befuddle.i18n";

export const befuddle: ActionCard = {
  id: "q0K",
  canonicalId: "ci_q0K",
  slug: "lorcana-ci_q0K",
  printings: [
    {
      id: "set1-062",
      artId: "set1-062",
      setCode: "set1",
      collectorNumber: "62",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set1-062"],
  cardType: "action",
  name: "Befuddle",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "001",
  cardNumber: 62,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6e2faccbf9a240219279b1c4acff7bd5",
    tcgPlayer: "503355",
  },
  text: "Return a character or item with cost 2 or less to their player's hand.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character", "item"],
          filter: [
            {
              type: "cost-comparison",
              comparison: "less-or-equal",
              value: 2,
            },
          ],
        },
      },
    },
  ],
  i18n: befuddleI18n,
};
