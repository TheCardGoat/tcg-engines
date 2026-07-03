import type { ActionCard } from "@tcg/lorcana-types";
import { standOutEpicI18n } from "./213-stand-out-epic.i18n";

export const standOutEpic: ActionCard = {
  id: "an9",
  canonicalId: "ci_h90",
  slug: "lorcana-ci_h90",
  printings: [
    {
      id: "set9-213-epic",
      artId: "ci_h90-epic",
      setCode: "set9",
      collectorNumber: "213",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set9-094"],
  cardType: "action",
  name: "Stand Out",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "009",
  cardNumber: 213,
  rarity: "common",
  specialRarity: "epic",
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
  i18n: standOutEpicI18n,
};
