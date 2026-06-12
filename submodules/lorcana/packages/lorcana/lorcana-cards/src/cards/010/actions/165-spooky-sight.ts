import type { ActionCard } from "@tcg/lorcana-types";
import { spookySightI18n } from "./165-spooky-sight.i18n";

export const spookySight: ActionCard = {
  id: "b2t",
  canonicalId: "ci_5Hw",
  reprints: ["set10-165"],
  cardType: "action",
  name: "Spooky Sight",
  inkType: ["sapphire"],
  set: "010",
  cardNumber: 165,
  rarity: "rare",
  cost: 6,
  inkable: false,
  externalIds: {
    lorcast: "crd_9a1fff8a9426484ebc7fae9cb8605572",
    tcgPlayer: 660011,
  },
  text: "Put all characters with cost 3 or less into their players' inkwells facedown and exerted.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "put-into-inkwell",
        source: "chosen-character",
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "cost-comparison",
              comparison: "less-or-equal",
              value: 3,
            },
          ],
        },
        facedown: true,
        exerted: true,
      },
    },
  ],
  i18n: spookySightI18n,
};
