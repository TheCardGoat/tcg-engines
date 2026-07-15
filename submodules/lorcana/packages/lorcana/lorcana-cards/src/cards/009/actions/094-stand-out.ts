import type { ActionCard } from "@tcg/lorcana-types";
import { standOutI18n } from "./094-stand-out.i18n";

export const standOut: ActionCard = {
  id: "uY9",
  canonicalId: "ci_h90",
  slug: "lorcana-ci_h90",
  printings: [
    {
      id: "set9-094",
      artId: "set9-094",
      setCode: "set9",
      collectorNumber: "94",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set9-094"],
  cardType: "action",
  name: "Stand Out",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "009",
  cardNumber: 94,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_d0049d68c901455c94c76afdd99a2745",
  },
  text: "Chosen character gets +3 {S} and gains Evasive until the start of your next turn.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 3,
            duration: "until-start-of-next-turn",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "gain-keyword",
            keyword: "Evasive",
            duration: "until-start-of-next-turn",
            target: {
              ref: "previous-target",
            },
          },
        ],
      },
    },
  ],
  i18n: standOutI18n,
};
