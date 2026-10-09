import type { ActionCard } from "@tcg/lorcana-types";
import { everyoneKnowsJuanitaI18n } from "./060-everyone-knows-juanita.i18n";

export const everyoneKnowsJuanita: ActionCard = {
  id: "nOm",
  canonicalId: "ci_nOm",
  slug: "lorcana-ci_nOm",
  printings: [
    {
      id: "set14-060",
      artId: "set14-060",
      setCode: "set14",
      collectorNumber: "60",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-060"],
  cardType: "action",
  name: "Everyone Knows Juanita",
  inkType: ["amethyst"],
  franchise: "Coco",
  set: "014",
  cardNumber: 60,
  rarity: "common",
  cost: 5,
  inkable: false,
  externalIds: {
    lorcast: "crd_7799029b28da4f72b7755e36a9f8c3a6",
  },
  text: "Draw 2 cards. If you have 10 or more cards in your discard, draw 3 cards instead.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Draw 2 cards. If you have 10 or more cards in your discard, draw 3 cards instead.",
      effect: {
        type: "conditional",
        condition: {
          type: "resource-count",
          what: "cards-in-discard",
          controller: "you",
          comparison: "greater-or-equal",
          value: 10,
        },
        then: {
          type: "draw",
          amount: 3,
          target: "CONTROLLER",
        },
        else: {
          type: "draw",
          amount: 2,
          target: "CONTROLLER",
        },
      },
    },
  ],
  i18n: everyoneKnowsJuanitaI18n,
};
