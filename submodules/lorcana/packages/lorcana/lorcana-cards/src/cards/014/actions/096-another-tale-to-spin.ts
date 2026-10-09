import type { ActionCard } from "@tcg/lorcana-types";
import { anotherTaleToSpinI18n } from "./096-another-tale-to-spin.i18n";

export const anotherTaleToSpin: ActionCard = {
  id: "FIu",
  canonicalId: "ci_FIu",
  slug: "lorcana-ci_FIu",
  printings: [
    {
      id: "set14-096",
      artId: "set14-096",
      setCode: "set14",
      collectorNumber: "96",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-096"],
  cardType: "action",
  name: "Another Tale to Spin",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 96,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_030ea6413a8847c49ec5035dda032698",
  },
  text: "Draw a card. You and another chosen player each get 1 ink drop. (Each ink drop may be removed to pay 1 {I}.)",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Draw a card. You and another chosen player each get 1 ink drop.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "gain-ink-drop",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "gain-ink-drop",
            amount: 1,
            target: { selector: "chosen", count: 1, excludeSelf: true },
          },
        ],
      },
    },
  ],
  i18n: anotherTaleToSpinI18n,
};
