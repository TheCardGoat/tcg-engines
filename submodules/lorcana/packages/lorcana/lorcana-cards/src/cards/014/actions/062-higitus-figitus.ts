import type { ActionCard } from "@tcg/lorcana-types";
import { higitusFigitusI18n } from "./062-higitus-figitus.i18n";

export const higitusFigitus: ActionCard = {
  id: "o6L",
  canonicalId: "ci_o6L",
  slug: "lorcana-ci_o6L",
  printings: [
    {
      id: "set14-062",
      artId: "set14-062",
      setCode: "set14",
      collectorNumber: "62",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-062"],
  cardType: "action",
  name: "Higitus Figitus",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 62,
  rarity: "common",
  cost: 6,
  inkable: true,
  externalIds: {
    lorcast: "crd_5d135313607b447594c17113428fcdbf",
  },
  text: "Get 3 ink drops. (Each ink drop may be removed to pay 1 {I}.)",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Get 3 ink drops. (Each ink drop may be removed to pay 1 {I}.)",
      effect: {
        type: "gain-ink-drop",
        amount: 3,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: higitusFigitusI18n,
};
