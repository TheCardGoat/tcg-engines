import type { ActionCard } from "@tcg/lorcana-types";
import { weveGotCompanyI18n } from "./147-weve-got-company.i18n";

export const weveGotCompany: ActionCard = {
  id: "JKW",
  canonicalId: "ci_JKW",
  reprints: ["set7-147"],
  cardType: "action",
  name: "We've Got Company!",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "007",
  cardNumber: 147,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_696163f5674e45ddb49ab917a6d91180",
    tcgPlayer: 619490,
  },
  text: "Ready all your characters. They gain Reckless this turn. (They can't quest and must challenge if able.)",
  abilities: [
    {
      effect: {
        steps: [
          {
            target: "YOUR_CHARACTERS",
            type: "ready",
          },
          {
            duration: "this-turn",
            keyword: "Reckless",
            target: "YOUR_CHARACTERS",
            type: "gain-keyword",
          },
        ],
        type: "sequence",
      },
      id: "inc-1",
      text: "Ready all your characters. They gain Reckless this turn.",
      type: "action",
    },
  ],
  i18n: weveGotCompanyI18n,
};
