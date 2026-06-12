import type { ActionCard } from "@tcg/lorcana-types";
import { twitterpatedI18n } from "./150-twitterpated.i18n";

export const twitterpated: ActionCard = {
  id: "WEP",
  canonicalId: "ci_WEP",
  reprints: ["set8-150"],
  cardType: "action",
  name: "Twitterpated",
  inkType: ["ruby"],
  franchise: "Bambi",
  set: "008",
  cardNumber: 150,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5bdb76e9410847a48c43a4a8b0f2ef81",
    tcgPlayer: 631450,
  },
  text: "Chosen character gains Evasive until the start of your next turn.",
  abilities: [
    {
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Evasive",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "11m-1",
      text: "Chosen character gains Evasive until the start of your next turn.",
      type: "action",
    },
  ],
  i18n: twitterpatedI18n,
};
