import type { ActionCard } from "@tcg/lorcana-types";
import { beKingUndisputedEpicI18n } from "./216-be-king-undisputed-epic.i18n";

export const beKingUndisputedEpic: ActionCard = {
  id: "1lp",
  canonicalId: "ci_th8",
  slug: "lorcana-ci_th8",
  printings: [
    {
      id: "set9-216-epic",
      artId: "ci_th8-epic",
      setCode: "set9",
      collectorNumber: "216",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set4-129", "set9-133"],
  cardType: "action",
  name: "Be King Undisputed",
  inkType: ["ruby"],
  franchise: "Lion King",
  set: "009",
  cardNumber: 216,
  rarity: "common",
  specialRarity: "epic",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_d47a329c9f87420c8c2714ea6f7fffde",
    tcgPlayer: "650152",
  },
  text: "Each opponent chooses and banishes one of their characters.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "banish",
        chosenBy: "opponent",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  i18n: beKingUndisputedEpicI18n,
};
