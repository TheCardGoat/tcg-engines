import type { ActionCard } from "@tcg/lorcana-types";
import { workTogetherI18n } from "./165-work-together.i18n";

export const workTogether: ActionCard = {
  id: "6w7",
  canonicalId: "ci_6w7",
  reprints: ["set1-165"],
  cardType: "action",
  name: "Work Together",
  inkType: ["sapphire"],
  franchise: "Emperors New Groove",
  set: "001",
  cardNumber: 165,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8f64870b7d4f490ea13c8da48ebe514b",
    tcgPlayer: 508889,
  },
  text: "Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
  abilities: [
    {
      type: "action",
      effect: {
        duration: "this-turn",
        keyword: "Support",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
    },
  ],
  i18n: workTogetherI18n,
};
