import type { ActionCard } from "@tcg/lorcana-types";
import { swingIntoActionI18n } from "./062-swing-into-action.i18n";

export const swingIntoAction: ActionCard = {
  id: "bPM",
  canonicalId: "ci_bPM",
  reprints: ["set4-062"],
  cardType: "action",
  name: "Swing into Action",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "004",
  cardNumber: 62,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_388773c70283456b87414157b1eebd98",
    tcgPlayer: 550571,
  },
  text: "Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Rush",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "r30-1",
      text: "Chosen character gains Rush this turn.",
      type: "action",
    },
  ],
  i18n: swingIntoActionI18n,
};
