import type { ActionCard } from "@tcg/lorcana-types";
import { youBrokeMySmolderI18n } from "./201-you-broke-my-smolder.i18n";

export const youBrokeMySmolder: ActionCard = {
  id: "jQI",
  canonicalId: "ci_jQI",
  slug: "lorcana-ci_jQI",
  printings: [
    {
      id: "set13-201",
      artId: "set13-201",
      setCode: "set13",
      collectorNumber: "201",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-201"],
  cardType: "action",
  name: "You Broke My Smolder",
  inkType: ["steel"],
  franchise: "Tangled",
  set: "013",
  cardNumber: 201,
  rarity: "uncommon",
  cost: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_5c1ae860c25940a7aac7c8633d58da21",
  },
  text: "Discard your hand. Draw 2 cards.",
  abilities: [
    {
      type: "action",
      text: "Discard your hand. Draw 2 cards.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "discard",
            amount: "all",
            from: "hand",
            target: "CONTROLLER",
          },
          {
            type: "draw",
            amount: 2,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: youBrokeMySmolderI18n,
};
