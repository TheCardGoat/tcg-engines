import type { ActionCard } from "@tcg/lorcana-types";
import { hesATrampI18n } from "./117-hes-a-tramp.i18n";

export const hesATramp: ActionCard = {
  id: "9Uj",
  canonicalId: "ci_9Uj",
  reprints: ["set7-117"],
  cardType: "action",
  name: "He's a Tramp",
  inkType: ["emerald"],
  franchise: "Lady and the Tramp",
  set: "007",
  cardNumber: 117,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_81b8d1f9be6542e0902b77e4ab51fae0",
    tcgPlayer: 618165,
  },
  text: "Chosen character gets +1 {S} this turn for each character you have in play.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: {
          controller: "you",
          type: "characters-in-play",
        },
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
      },
      type: "action",
    },
  ],
  i18n: hesATrampI18n,
};
