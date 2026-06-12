import type { ActionCard } from "@tcg/lorcana-types";
import { whatDidYouCallMeI18n } from "./132-what-did-you-call-me.i18n";

export const whatDidYouCallMe: ActionCard = {
  id: "Dew",
  canonicalId: "ci_Dew",
  reprints: ["set2-132"],
  cardType: "action",
  name: "What Did You Call Me?",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "002",
  cardNumber: 132,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b62b44f1e2144c1e9ebec3da471579c3",
    tcgPlayer: 527760,
  },
  text: "Chosen damaged character gets +3 {S} this turn.",
  abilities: [
    {
      type: "action",
      effect: {
        duration: "this-turn",
        modifier: 3,
        stat: "strength",
        target: "CHOSEN_DAMAGED_CHARACTER",
        type: "modify-stat",
      },
    },
  ],
  i18n: whatDidYouCallMeI18n,
};
